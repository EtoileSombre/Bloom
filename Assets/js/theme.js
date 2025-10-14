// theme.js — gestion du thème
(function(ns){
  const $theme = ns.$('#themeToggle');

  // Initialisation
  (function(){
    const t = ns.storage.get(ns.K_THEME,'dark');
    document.documentElement.classList.toggle('light', t==='light');
    if($theme) $theme.setAttribute('aria-pressed', String(t==='light'));
  })();

  if($theme){
    $theme.addEventListener('click', ()=>{
      const mode = document.documentElement.classList.toggle('light') ? 'light' : 'dark';
      ns.storage.set(ns.K_THEME, mode);
      $theme.setAttribute('aria-pressed', String(mode==='light'));
    });
  }
})(window.Bloom);
