// storage.js — helpers et clés globales
window.Bloom = window.Bloom || {};

(function(ns){
  ns.$ = (s, el=document) => el.querySelector(s);

  ns.storage = {
    get:(k,f=null)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(f)),
    set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
  };

  ns.K_GOALS = 'bloom.goals.v1';
  ns.K_LOGS  = 'bloom.logs.v1';
  ns.K_THEME = 'bloom.theme.v1';

  ns.todayISO = () => new Date().toISOString().slice(0,10);
})(window.Bloom);
