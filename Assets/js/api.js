// api.js — client REST Bloom
window.Bloom = window.Bloom || {};

(function(ns) {
  var BASE = '/api';

  ns.api = {

    // Récupère tous les objectifs avec leur streak et leur état du jour
    getGoals: function() {
      return fetch(BASE + '/goals/with-streaks')
        .then(function(res) {
          if (!res.ok) throw new Error('Erreur chargement objectifs');
          return res.json();
        });
    },

    // Crée un nouvel objectif
    addGoal: function(title, icon) {
      return fetch(BASE + '/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, icon: icon })
      }).then(function(res) {
        if (!res.ok) throw new Error('Erreur ajout objectif');
        return res.json();
      });
    },

    // Supprime un objectif par id
    deleteGoal: function(id) {
      return fetch(BASE + '/goals/' + id, { method: 'DELETE' })
        .then(function(res) {
          if (!res.ok) throw new Error('Erreur suppression objectif');
        });
    },

    // Coche ou décoche un objectif pour aujourd'hui
    setCheck: function(goalId, checked) {
      return fetch(BASE + '/checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: goalId, checked: checked })
      }).then(function(res) {
        if (!res.ok) throw new Error('Erreur mise à jour coche');
      });
    }
  };

})(window.Bloom);
