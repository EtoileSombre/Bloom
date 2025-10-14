// actions.js — interactions (cocher & ajouter)
(function(ns){
  var $goals = ns.$('#goals');
  var $form  = ns.$('#goalForm');
  var $title = ns.$('#goalTitle');

  // Clic sur les cases à cocher
  if ($goals){
    $goals.addEventListener('click', function(e){
      var card = e.target.closest('.card'); if (!card) return;
      if (e.target.matches('.toggle')){
        var id = card.getAttribute('data-id');
        var logs = ns.storage.get(ns.K_LOGS, {});
        var k = ns.todayISO();
        var set = new Set(logs[k] || []);
        if (e.target.checked) set.add(id); else set.delete(id);
        logs[k] = Array.from(set);
        ns.storage.set(ns.K_LOGS, logs);

        // annonce a11y (facultatif)
        var live = document.getElementById('live');
        if (live) live.textContent = e.target.checked ? 'Objectif coché pour aujourd’hui.' : 'Objectif décoché pour aujourd’hui.';

        ns.render();
      }
    });
  }

  // Ajout d’un objectif
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

      // annonce a11y (facultatif)
      var live = document.getElementById('live');
      if (live) live.textContent = 'Objectif ajouté.';

      ns.render();
    });
  }
})(window.Bloom);
