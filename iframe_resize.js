// When this page is shown inside an iframe (orditus.com), report its content
// height to the parent page so the iframe can grow and shrink to fit.
// The parent listens for {ordHeight: <px>} messages from this origin.
(function () {
  if (window.parent === window) return;
  var last = 0;
  function send() {
    var h = Math.ceil(document.body.getBoundingClientRect().height);
    if (h === last) return;
    last = h;
    window.parent.postMessage({ ordHeight: h }, "*");
  }
  if (window.ResizeObserver) new ResizeObserver(send).observe(document.body);
  window.addEventListener("load", send);
  send();
})();
