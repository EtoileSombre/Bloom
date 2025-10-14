// main.js — initialisation
(function(ns){
  if(!ns.storage.get(ns.K_GOALS))
    ns.storage.set(ns.K_GOALS, [
      {id:crypto.randomUUID(),title:'10 min d’anglais',icon:'📚',createdAt:Date.now(),streak:0},
      {id:crypto.randomUUID(),title:'Respiration 3 min',icon:'🌱',createdAt:Date.now(),streak:0}
    ]);
  if(!ns.storage.get(ns.K_LOGS))
    ns.storage.set(ns.K_LOGS, {});

  ns.render();
})(window.Bloom);
