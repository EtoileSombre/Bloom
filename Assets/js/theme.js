// theme.js — bascule clair/sombre robuste et indépendante
(function(ns){
  var KEY = ns.K_THEME || 'bloom.theme.v1';
  var btn = ns.$('#themeToggle');

  function getInitialTheme(){
    var saved = ns.storage && ns.storage.get ? ns.storage.get(KEY, null) : null;
    if (saved === 'light' || saved === 'dark') return saved;
    var prefersLight = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  function apply(mode){
    document.documentElement.classList.toggle('light', mode === 'light');
    if (btn) btn.setAttribute('aria-pressed', String(mode === 'light'));
  }

  function init(){
    var mode = getInitialTheme();
    apply(mode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (btn){
    btn.addEventListener('click', function(){
      var next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
      apply(next);
      if (ns.storage && ns.storage.set) ns.storage.set(KEY, next);
    });
  }
})(window.Bloom = window.Bloom || {});
