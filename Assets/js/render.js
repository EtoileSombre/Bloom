// render.js — affichage principal (robuste, sans planter si un ID manque)
(function(ns){
  var $goals  = ns.$('#goals');
  var $garden = ns.$('#gardenView');
  var $bar    = ns.$('#progressBar');
  var $badge  = ns.$('#badgeInfo');

  // Calcule le streak consécutif (en jours) pour un objectif donné à partir des logs
  function computeStreak(goalId, logs) {
    // On compte à rebours à partir d’aujourd’hui (inclus si coché)
    var streak = 0;
    var d = new Date(ns.todayISO()); // à minuit
    for (;;) {
      var iso = d.toISOString().slice(0,10);
      var arr = logs[iso] || [];
      if (arr.indexOf(goalId) !== -1) {
        streak++;
        // recule d'un jour
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  ns.render = function(){
    var goals = ns.storage.get(ns.K_GOALS, []);
    var logs  = ns.storage.get(ns.K_LOGS,  {});
    var today = ns.todayISO();
    var todaySet = new Set(logs[today] || []);

    // 1) Liste
    if ($goals) {
      if (!goals.length) {
        $goals.innerHTML = '<div class="card"><p class="muted">Ajoute ton premier objectif ✨</p></div>';
      } else {
        var html = '';
        for (var i=0;i<goals.length;i++){
          var g = goals[i];
          var checked = todaySet.has(g.id) ? 'checked' : '';
          var streak  = computeStreak(g.id, logs); // calcul à la volée
          html += ''
            + '<article class="card" data-id="'+g.id+'" role="listitem">'
            + '  <div class="row">'
            + '    <div style="display:flex;align-items:center;gap:.6rem;">'
            + '      <input class="toggle" type="checkbox" '+checked+' aria-label="Marquer \''+(g.title)+'\' comme fait">'
            + '      <span style="font-size:1.2rem">'+g.icon+'</span>'
            + '      <strong>'+g.title+'</strong>'
            + '    </div>'
            + '    <span class="badge" aria-label="Série de jours consécutifs">🔥 '+streak+'</span>'
            + '  </div>'
            + '</article>';
        }
        $goals.innerHTML = html;
      }
    }

    // 2) Progression du jour + emoji plante
    var percent = goals.length ? Math.round((todaySet.size / goals.length) * 100) : 0;
    if ($bar)    $bar.style.width = percent + '%';
    if ($garden) {
      var plant = percent===100 ? '🌳' : percent>=75 ? '🌸' : percent>=50 ? '🌷' : percent>=25 ? '🌿' : '🌱';
      $garden.textContent = plant + ' ' + percent + '%';
    }

    // 3) Badge du jour (simple et visible)
    if ($badge) {
      // si 100% aujourd’hui → badge visible
      if (percent === 100) {
        $badge.textContent = '🏅 Tout est fait aujourd’hui !';
      } else {
        // ou si au moins un objectif a une série ≥ 7 jours
        var has7 = goals.some(function(g){ return computeStreak(g.id, logs) >= 7; });
        $badge.textContent = has7 ? '🏅 Badge “Constante” : 7 jours !' : 'Aucun badge pour l’instant.';
      }
    }
  };
})(window.Bloom);
