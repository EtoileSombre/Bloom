// actions.js — interactions (cocher, ajouter, supprimer) via API
(function(ns){
  var $goals = ns.$('#goals');
  var $form  = ns.$('#goalForm');
  var $title = ns.$('#goalTitle');

  function announce(msg){
    var live = document.getElementById('live');
    if (live) live.textContent = msg;
  }

  if ($goals){
    $goals.addEventListener('click', function(e){
      var card = e.target.closest('.card'); if (!card) return;
      var id = card.getAttribute('data-id');

      // Cocher / décocher
      if (e.target.matches('.toggle')){
        var isChecked = e.target.checked;
        ns.api.setCheck(id, isChecked)
          .then(function(){
            announce(isChecked ? "Objectif coché pour aujourd'hui." : "Objectif décoché pour aujourd'hui.");
            ns.render();
          })
          .catch(function(){ announce('Erreur lors de la mise à jour.'); });
        return;
      }

      // Supprimer
      if (e.target.matches('.del')){
        if (!confirm('Supprimer cet objectif ?')) return;
        ns.api.deleteGoal(id)
          .then(function(){
            announce('Objectif supprimé.');
            ns.render();
          })
          .catch(function(){ announce('Erreur lors de la suppression.'); });
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

      ns.api.addGoal(title, icon)
        .then(function(){
          if ($title) $title.value = '';
          announce('Objectif ajouté.');
          ns.render();
        })
        .catch(function(){ announce("Erreur lors de l'ajout."); });
    });
  }
})(window.Bloom);
