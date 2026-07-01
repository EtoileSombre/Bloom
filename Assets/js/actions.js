// actions.js — interactions (cocher, ajouter, supprimer) via API
document.addEventListener('DOMContentLoaded', function(){
  (function(ns){
    var $goals  = ns.$('#goals');
    var $form   = ns.$('#goalForm');
    var $title  = ns.$('#goalTitle');
    var $icon   = ns.$('#goalIcon');
    var $submit = $form ? $form.querySelector('[type="submit"]') : null;

    function announce(msg){
      var live = document.getElementById('live');
      if (live) live.textContent = msg;
    }

    // ── change : active le bouton seulement si le titre est renseigné ──────────
    if ($title && $submit){
      $submit.disabled = true;
      $title.addEventListener('change', function(){
        $submit.disabled = $title.value.trim() === '';
      });
    }

    // ── click : cocher / décocher / supprimer (délégation sur le conteneur) ────
    if ($goals){
      $goals.addEventListener('click', function(e){
        var card = e.target.closest('.card'); if (!card) return;
        var id = card.getAttribute('data-id');

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

    // ── submit : ajouter un objectif ───────────────────────────────────────────
    if ($form){
      $form.addEventListener('submit', function(e){
        e.preventDefault();
        var fd    = new FormData($form);
        var title = String(fd.get('title') || '').trim();
        var icon  = String(fd.get('icon')  || ($icon ? $icon.value : '🌱'));
        if (!title) return;

        ns.api.addGoal(title, icon)
          .then(function(){
            if ($title)  $title.value   = '';
            if ($submit) $submit.disabled = true;
            announce('Objectif ajouté.');
            ns.render();
          })
          .catch(function(){ announce("Erreur lors de l'ajout."); });
      });
    }

  })(window.Bloom);
});
