// render.js — affichage principal
(function(ns){
  const $goals  = ns.$('#goals');
  const $garden = ns.$('#gardenView');
  const $bar    = ns.$('#progressBar');
  const $badge  = ns.$('#badgeInfo');

  ns.render = function(){
    const goals = ns.storage.get(ns.K_GOALS, []);
    const logs  = ns.storage.get(ns.K_LOGS, {});
    const done  = new Set(logs[ns.todayISO()]||[]);

    $goals.innerHTML = goals.map(g=>`
      <article class="card" data-id="${g.id}">
        <div class="row">
          <div style="display:flex;align-items:center;gap:.6rem;">
            <input class="toggle" type="checkbox" ${done.has(g.id)?'checked':''} aria-label="Marquer '${g.title}' comme fait">
            <span style="font-size:1.2rem">${g.icon}</span>
            <strong>${g.title}</strong>
          </div>
          <span class="badge">🔥 ${g.streak||0}</span>
        </div>
      </article>
    `).join('') || `<div class="card"><p class="muted">Ajoute ton premier objectif ✨</p></div>`;

    const percent = goals.length ? Math.round((done.size/goals.length)*100) : 0;
    $bar.style.width = percent+'%';
    const plant = percent===100?'🌳':percent>=75?'🌸':percent>=50?'🌷':percent>=25?'🌿':'🌱';
    $garden.textContent = `${plant} ${percent}%`;
    $badge.textContent = goals.some(g=>(g.streak||0)>=7)
      ? '🏅 Badge “Constante” : 7 jours !'
      : 'Aucun badge pour l’instant.';
  };
})(window.Bloom);
