// scripts/load-shared.js
(function(){
  // Determina el "base" automáticamente si está en GitHub Pages (username.github.io/repo/)
  let BASE = '/';
  try {
    if (location.hostname.endsWith('github.io')) {
      const segs = location.pathname.split('/').filter(Boolean);
      if (segs.length > 0) BASE = `/${segs[0]}/`;
    }
  } catch(e) { BASE = '/'; }

  function include(elemId, relativePath) {
    const host = document.getElementById(elemId);
    if (!host) return Promise.resolve();
    return fetch(BASE + relativePath, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        return res.text();
      })
      .then(html => { host.innerHTML = html; })
      .catch(err => { console.error('Include error:', relativePath, err); host.innerHTML = ''; });
  }

  function loadScript(relativePath, cb) {
    if (document.querySelector(`script[data-src="${relativePath}"]`)) { if(cb) cb(); return; }
    const s = document.createElement('script');
    s.src = BASE + relativePath;
    s.defer = true;
    s.setAttribute('data-src', relativePath);
    s.onload = cb || function(){};
    s.onerror = function(e){ console.error('Error loading', relativePath, e); if(cb) cb(); };
    document.body.appendChild(s);
  }

  window.loadShared = function(){
    Promise.all([
      include('header', 'shared/header.html'),
      include('footer', 'shared/footer.html')
    ]).then(() => {
      // cargar carrito.js después que header/footer estén inyectados (para que exista el badge)
      loadScript('scripts/carrito.js', function(){
        if (window.Cart && typeof window.Cart.updateBadge === 'function') {
          try { window.Cart.updateBadge(); } catch(e){}
        }
        if (window.Cart && typeof window.Cart.renderCartIfPresent === 'function') {
          try { window.Cart.renderCartIfPresent(); } catch(e){}
        }
      });
    });
  };

  // Auto-ejecutar cuando el DOM esté listo
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadShared();
  } else {
    document.addEventListener('DOMContentLoaded', loadShared);
  }
})();
