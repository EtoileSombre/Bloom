// api.js — client REST Bloom
window.Bloom = window.Bloom || {};

(function(ns) {
  var BASE = '/api';

  ns.api = {

    // Récupère tous les objectifs avec leur streak et leur état du jour
    getGoals: async function() {
      const res = await fetch(BASE + '/goals/with-streaks');
      if (!res.ok) throw new Error('Erreur chargement objectifs');
      return res.json();
    },

    // Crée un nouvel objectif puis déclenche la reconstruction de la vue
    addGoal: async function(title, icon) {
      const res = await fetch(BASE + '/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, icon: icon })
      });
      if (!res.ok) throw new Error('Erreur ajout objectif');
      return res.json();
    },

    // Supprime un objectif puis déclenche la reconstruction de la vue
    deleteGoal: async function(id) {
      const res = await fetch(BASE + '/goals/' + id, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur suppression objectif');
    },

    // Coche ou décoche un objectif puis déclenche la reconstruction de la vue
    setCheck: async function(goalId, checked) {
      const res = await fetch(BASE + '/checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: goalId, checked: checked })
      });
      if (!res.ok) throw new Error('Erreur mise à jour coche');
    }
  };

})(window.Bloom);
