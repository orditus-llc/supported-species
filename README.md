# Supported Species - iDEP / ShinyGO

Species pages for [orditus.com](https://orditus.com), served by GitHub Pages and shown on WordPress in iframes.

## Files

| File | Live at | Shown on |
|---|---|---|
| `index.html` | [orditus-llc.github.io/supported-species/](https://orditus-llc.github.io/supported-species/) | orditus.com/supported-species/ |
| `database-search.html` | [orditus-llc.github.io/supported-species/database-search.html](https://orditus-llc.github.io/supported-species/database-search.html) | orditus.com/database-search/ |
| `species_app.js` | Search logic, loaded by `database-search.html` | |
| `species_catalog.js` | Species data, loaded by `database-search.html` | |
| `iframe_resize.js` | Tells WordPress each page's height so the iframe fits | |
| `species_catalog.json` | Same data as JSON. Not used by the site. | |

## Updating

Push to `main`. Pages and orditus.com update in a few minutes. Nothing to re-paste.

## WordPress snippet

Each WordPress page has one Custom HTML block. Change `src` per page.

```html
<iframe src="https://orditus-llc.github.io/supported-species/"
  title="Supported species" style="width:100%;height:1700px;border:0;display:block"></iframe>
<script>
window.addEventListener("message", function (e) {
  if (e.origin !== "https://orditus-llc.github.io" || !e.data || !e.data.ordHeight) return;
  document.querySelectorAll("iframe").forEach(function (f) {
    if (f.contentWindow === e.source) f.style.height = e.data.ordHeight + "px";
  });
});
</script>
```

If WordPress strips the `<script>`, the iframe still works at the fixed height.
