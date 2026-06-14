// storage.js — utilitaires globaux
window.Bloom = window.Bloom || {};

(function(ns){
  ns.$ = (s, el=document) => el.querySelector(s);

  // Conservé uniquement pour le thème
  ns.storage = {
    get:(k,f=null)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(f)),
    set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
  };

  ns.K_THEME = 'bloom.theme.v1';
})(window.Bloom);
