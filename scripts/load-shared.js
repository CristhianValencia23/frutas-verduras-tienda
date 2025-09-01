// load-shared.js - carga header/footer de forma dinámica y arregla rutas
(function(){
  var BASE = "/";
  try {
    if (location.hostname && location.hostname.endsWith("github.io")) {
      var segs = location.pathname.split('/').filter(Boolean);
      if (segs.length > 0) BASE = '/' + segs[0] + '/';
    }
  } catch (e) { BASE = "/"; }

  function fetchText(path) {
    return fetch(BASE + path, { cache: 'no-store' }).then(function(res){
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      return res.text();
    });
  }

  function include(elemId, relativePath) {
    var host = document.getElementById(elemId);
    if (!host) return Promise.resolve();
    return fetchText(relativePath).then(function(html){ host.innerHTML = html; rewriteLinks(host); }).catch(function(err){ console.error('Include error', relativePath, err); host.innerHTML = ''; });
  }

  function rewriteLinks(host) {
    try {
      var anchors = host.querySelectorAll('a[href]');
      anchors.forEach(function(a){
        var href = a.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || href.startsWith('mailto:') || href.match(/^[a-zA-Z]+:\/\//) || href.startsWith('/')) return;
        a.setAttribute('href', BASE + href.replace(/^\.\//, ''));
      });
      var imgs = host.querySelectorAll('img[src]');
      imgs.forEach(function(img){
        var src = img.getAttribute('src');
        if (!src) return;
        if (src.match(/^[a-zA-Z]+:\/\//) || src.startsWith('/')) return;
        img.setAttribute('src', BASE + src.replace(/^\.\//, ''));
      });
    } catch(e){ console.error('rewriteLinks error', e); }
  }

  function loadScriptOnce(path, cb) {
    if (document.querySelector('script[data-load="'+path+'"]')) { if (cb) cb(); return; }
    var s = document.createElement('script');
    s.setAttribute('data-load', path);
    s.src = BASE + path;
    s.defer = true;
    s.onload = function(){ if(cb) cb(); };
    s.onerror = function(e){ console.error('Error loading script', path, e); if(cb) cb(); };
    document.body.appendChild(s);
  }

  window.loadShared = function() {
    Promise.all([ include('header', 'shared/header.html'), include('footer', 'shared/footer.html') ])
    .then(function(){
      loadScriptOnce('scripts/carrito.js', function(){
        if (window.Cart && typeof window.Cart.updateBadge === 'function') {
          try { window.Cart.updateBadge(); } catch(e) {}
        }
        if (window.Cart && typeof window.Cart.renderCartIfPresent === 'function') {
          try { window.Cart.renderCartIfPresent(); } catch(e) {}
        }
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadShared);
  } else {
    loadShared();
  }
})();