// actions.js — interactions utilisateur
(function(ns){
  const $goals = ns.$('#goals');
  const $form  = ns.$('#goalForm');
  const $title = ns.$('#goalTitle');

  // Clic sur les checkboxes
  if($goals){
    $goals.addEventListener('click',(e)=>{
      const card = e.target.closest('.card'); if(!card) return;
      if(e.target.matches('.toggle')){
        const id = card.dataset.id;
        const logs = ns.storage.get(ns.K_LOGS,{});
        const k = ns.todayISO();
        const set = new Set(logs[k]||[]);
        e.target.checked ? set.add(id) : set.delete(id);
        logs[k] = [...set];
        ns.storage.set(ns.K_LOGS, logs);
        ns.render();
      }
    });
  }

  // Soumission du formulaire
  if($form){
    $form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const fd = new FormData($form);
      const title = String(fd.get('title')||'').trim();
      const icon  = String(fd.get('icon')||'🌱');
      if(!title) return;
      const goals = ns.storage.get(ns.K_GOALS, []);
      goals.push({id:crypto.randomUUID(), title, icon, createdAt:Date.now(), streak:0});
      ns.storage.set(ns.K_GOALS, goals);
      $title.value='';
      ns.render();
    });
  }
})(window.Bloom);
