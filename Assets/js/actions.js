// actions.js — interactions (cocher, ajouter, supprimer)
(function(ns){
  var $goals = ns.$('#goals');
  var $form  = ns.$('#goalForm');
  var $title = ns.$('#goalTitle');

  function announce(msg){
    var live = document.getElementById('live');
    if (live) live.textContent = msg;
  }

  // Supprime un objectif et purge les logs sur toutes les dates
  function deleteGoal(id){
    var goals = ns.storage.get(ns.K_GOALS, []).filter(function(g){ return g.id !== id; });
    ns.storage.set(ns.K_GOALS, goals);

    var logs = ns.storage.get(ns.K_LOGS, {});
    Object.keys(logs).forEach(function(day){
      logs[day] = (logs[day]||[]).filter(function(x){ return x !== id; });
      if (!logs[day].length) delete logs[day];
    });
    ns.storage.set(ns.K_LOGS, logs);
  }

  if ($goals){
    $goals.addEventListener('click', function(e){
      var card = e.target.closest('.card'); if (!card) return;
      var id = card.getAttribute('data-id');

      // Cocher / décocher
      if (e.target.matches('.toggle')){
        var logs = ns.storage.get(ns.K_LOGS, {});
        var k = ns.todayISO();
        var set = new Set(logs[k] || []);
        if (e.target.checked) { set.add(id); announce('Objectif coché pour aujourd’hui.'); }
        else { set.delete(id); announce('Objectif décoché pour aujourd’hui.'); }
        logs[k] = Array.from(set);
        ns.storage.set(ns.K_LOGS, logs);
        ns.render();
        return;
      }

      // Supprimer
      if (e.target.matches('.del')){
        if (!confirm('Supprimer cet objectif ?')) return;
        deleteGoal(id);
        announce('Objectif supprimé.');
        ns.render();
        return;
      }
    });
  }

  if ($form){
    $form.addEventListener('submit', function(e){
      e.preventDefault();
      var fd = new FormData($form);
      var title = String(fd.get('title') || '').trim();
      var icon  = String(fd.get('icon')  || '🌱');
      if (!title) return;

      var goals = ns.storage.get(ns.K_GOALS, []);
      goals.push({ id: crypto.randomUUID(), title: title, icon: icon, createdAt: Date.now() });
      ns.storage.set(ns.K_GOALS, goals);

      if ($title) $title.value = '';
      announce('Objectif ajouté.');
      ns.render();
    });
  }
})(window.Bloom);
