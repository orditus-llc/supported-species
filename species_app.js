(function(){
  var results=document.getElementById("osp-results"),
      legend=document.getElementById("osp-legend"),
      qEl=document.getElementById("osp-q");
  function clean(x){ return (x||"").replace(/ /g," ").replace(/\*+\s*$/,"").trim(); }
  function cleanName(s){ return (s||"?").replace(/\s*STRINGdb\s*$/i,"").trim() || "?"; }
  function srcClass(s){ return (s==="STRING-db")?"STRINGdb":(s||"Ensembl"); }

  if (typeof window.CATALOG==="undefined") {
    results.innerHTML='<div class="note warn"><b>No data yet.</b> The <code>species_catalog.js</code> data file did not load. Check the script URL.</div>';
    return;
  }
  var C=window.CATALOG, SP=C.species.slice();
  SP.forEach(function(sp){ sp._s=((sp.common||"")+" "+(sp.latin||"")+" "+(sp.source||"")+" "+(sp.taxid||"")).toLowerCase(); });

  var total=C.meta.total_species||SP.length;
  document.getElementById("osp-headline").textContent=Number(total).toLocaleString();
  var bs=C.meta.by_source||{}; var order=["Ensembl","STRING-db","Custom"];
  var keys=order.filter(function(k){return k in bs;}); for(var k in bs){ if(keys.indexOf(k)<0) keys.push(k); }
  var parts=keys.map(function(k){ return Number(bs[k]).toLocaleString()+" "+k; });
  document.getElementById("osp-stats2").textContent=parts.join("  ·  ");
  document.getElementById("osp-ver-line").textContent="Data version "+C.meta.db_ver+".";

  var SRC_CLASSES=["Ensembl","STRING-db","Custom"];
  var SRC_COLS=[["kegg","KEGG"],["go","GO terms"],["reactome","Reactome"],["msigdb","MSigDB"]];
  function flag(sp,key){ var v=(sp.has && key in sp.has)?sp.has[key]:(key==="kegg"?sp.kegg:undefined);
    if(v===true)  return '<span class="yes" title="Available">&#10003;</span>';
    if(v===false) return '<span class="no" title="Not included">&ndash;</span>';
    return '<span class="no" title="Supported; full breakdown not yet listed">&ndash;</span>'; }
  var activeSrc=null, sortKey="featured", sortDir=-1, LIMIT=100, t=null;

  function sc(){ var h='<span class="legend" style="margin-right:4px">Source:</span>';
    SRC_CLASSES.forEach(function(s){ h+='<span class="chipbtn'+(activeSrc===s?" on":"")+'" data-s="'+s+'">'+s+'</span>'; });
    document.getElementById("osp-srcchips").innerHTML=h; }

  function matches(sp,q){
    if (activeSrc && sp.sclass!==activeSrc) return false;
    if (!q) return true;
    return q.toLowerCase().split(/\s+/).every(function(tok){
      if (sp._s.indexOf(tok)>=0) return true;
      if (tok==="kegg" && sp.kegg) return true;
      if (sp.categories){ for(var cat in sp.categories){ var a=sp.categories[cat];
        for(var j=0;j<a.length;j++){ if((a[j].name||"").toLowerCase().indexOf(tok)>=0) return true; } } }
      return false; });
  }

  function detailHTML(sp){
    var meta=(sp.assembly?("Assembly "+sp.assembly+". "):"");
    if (!sp.featured || !sp.categories){
      return '<div class="legend">'+meta+"Standard GO/KEGG baseline. A full gene-set breakdown is available for "+(C.meta.n_with_depth||0)+" species so far.</div>";
    }
    var isString=(sp.sclass==="STRING-db"), unit=isString?"annotations":"sets";
    var countNote=isString
      ? "Counts show gene-to-term annotations (memberships), not the number of gene sets."
      : "Counts show the number of gene sets in each collection.";
    var h='<div class="legend" style="margin-bottom:2px">'+meta+"<b>"+(sp.n_sources||0)+"</b> gene-set sources.</div>"
      +'<div class="legend countnote">'+countNote+"</div>";
    for (var cat in sp.categories){ var arr=(sp.categories[cat]||[]).filter(function(it){return clean(it.name);}); if(!arr.length) continue;
      h+='<div class="cat"><h4>'+cat+" ("+arr.length+")</h4><div class=\"catlist\">";
      arr.forEach(function(it){ var nm=clean(it.name);
        var n=(it.n!=null)?'<span class="n">'+Number(it.n).toLocaleString()+'</span> <span class="u">'+unit+"</span>":"";
        h+='<div class="gsrow"><span class="gsname">'+nm+'</span><span class="gsnum">'+n+"</span></div>"; });
      h+="</div></div>"; }
    return h;
  }

  function render(){
    var q=qEl.value.trim();
    var rows=SP.filter(function(s){return matches(s,q);});
    rows.sort(function(a,b){ if(sortKey==="featured"){ var d=(b.featured?1:0)-(a.featured?1:0); if(d) return d; return (b.n_sources||0)-(a.n_sources||0); }
      var av=a[sortKey],bv=b[sortKey]; return (typeof av==="string")?sortDir*((av||"").localeCompare(bv||"")):sortDir*((av||0)-(bv||0)); });
    var totalN=rows.length, capped=rows.slice(0,LIMIT);
    legend.textContent=totalN.toLocaleString()+" of "+SP.length.toLocaleString()+" species"+(q?" for \""+q+"\"":"")
      +(totalN>LIMIT?(" (showing first "+LIMIT+")"):"")+".";
    if(!totalN){ results.innerHTML='<div class="note">We could not find that. Try the latin name (e.g. Mus musculus) or the taxonomy id (e.g. 10090). Most sequenced organisms are supported through the broad STRING-db set.</div>'; return; }
    var h='<div class="tablewrap"><table><thead><tr>'
      +'<th class="sphead" data-k="common">Species<span class="rowhint">Click a row for details</span></th><th data-k="sclass">Source</th>'
      +'<th class="num" data-k="taxid">Tax ID</th>'
      + SRC_COLS.map(function(p){return '<th class="c">'+p[1]+"</th>";}).join("")
      +"</tr></thead><tbody>";
    capped.forEach(function(sp,idx){
      var nm=cleanName(sp.common);
      h+='<tr class="spp" data-i="'+idx+'"><td><div class="spcell" title="'+nm+'"><span class="arrow">&#9656;</span> <span class="common">'+nm+"</span> "
        +(sp.latin?'<span class="latin">'+sp.latin+"</span>":"")+(sp.assembly?' <span class="asm">'+sp.assembly+"</span>":"")+"</div></td>"
        +'<td><span class="src '+srcClass(sp.sclass)+'">'+(sp.sclass||"?")+"</span></td>"
        +'<td class="num">'+(sp.taxid!=null?sp.taxid:"")+"</td>"
        + SRC_COLS.map(function(p){return '<td class="c">'+flag(sp,p[0])+"</td>";}).join("")
        +"</tr>"
        +'<tr class="detail" id="osp-d'+idx+'" style="display:none"><td colspan="'+(3+SRC_COLS.length)+'">'+detailHTML(sp)+"</td></tr>";
    });
    h+="</tbody></table></div>"; results.innerHTML=h;
    Array.prototype.forEach.call(results.querySelectorAll("tr.spp"),function(tr){ tr.addEventListener("click",function(){
      var d=document.getElementById("osp-d"+tr.getAttribute("data-i")); var open=d.style.display!=="none";
      d.style.display=open?"none":"table-row"; tr.querySelector(".arrow").innerHTML=open?"&#9656;":"&#9662;"; }); });
  }
  function debounced(){ clearTimeout(t); t=setTimeout(render,130); }
  qEl.addEventListener("input",debounced);
  document.getElementById("osp-srcchips").addEventListener("click",function(e){ var s=e.target.getAttribute("data-s"); if(!s) return; activeSrc=(activeSrc===s)?null:s; sc(); render(); });
  sc(); render();
})();
