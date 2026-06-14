// render.js 
(function(ns){
  var $goals  = ns.$('#goals');
  var $garden = ns.$('#gardenView');
  var $bar    = ns.$('#progressBar');
  var $badge  = ns.$('#badgeInfo');

  // Cree un element DOM avec des proprietes
  function el(tag, props, children) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function(k) {
        if (k === 'style') {
          node.style.cssText = props[k];
        } else {
          node.setAttribute(k, props[k]);
        }
      });
    }
    if (children) {
      children.forEach(function(child) {
        if (typeof child === 'string') {
          node.appendChild(document.createTextNode(child));
        } else if (child) {
          node.appendChild(child);
        }
      });
    }
    return node;
  }

  // Construit la carte d un objectif 
  function buildCard(g) {
    var checkbox = el('input', {
      class: 'toggle',
      type: 'checkbox',
      'aria-label': "Marquer '" + g.title + "' comme fait"
    });
    if (g.checkedToday) checkbox.checked = true;

    var iconSpan  = el('span', { style: 'font-size:1.2rem' }, [g.icon]);
    var titleEl   = el('strong', {}, [g.title]);
    var leftDiv   = el('div', { style: 'display:flex;align-items:center;gap:.6rem;' }, [checkbox, iconSpan, titleEl]);

    var delBtn    = el('button', {
      type: 'button',
      class: 'btn ghost del',
      'aria-label': "Supprimer l'objectif"
    }, ['🗑️']);
    var rightDiv  = el('div', { style: 'display:flex;gap:.4rem' }, [delBtn]);

    var row       = el('div', { class: 'row' }, [leftDiv, rightDiv]);
    var streak    = el('div', { class: 'muted', 'aria-label': 'Série de jours consécutifs' }, ['🔥 ' + g.streak]);

    var article   = el('article', {
      class: 'card',
      'data-id': String(g.id),
      role: 'listitem'
    }, [row, streak]);

    return article;
  }

  ns.render = function(){
    ns.api.getGoals()
      .then(function(goals){
        var checkedCount = goals.filter(function(g){ return g.checkedToday; }).length;

        if ($goals) {
          // Vide le conteneur proprement
          while ($goals.firstChild) $goals.removeChild($goals.firstChild);

          if (!goals.length) {
            var emptyCard = el('div', { class: 'card' }, [
              el('p', { class: 'muted' }, ['Ajoute ton premier objectif ✨'])
            ]);
            $goals.appendChild(emptyCard);
          } else {
            goals.forEach(function(g) {
              $goals.appendChild(buildCard(g));
            });
          }
        }

        var percent = goals.length ? Math.round((checkedCount / goals.length) * 100) : 0;
        if ($bar)    $bar.style.width = percent + '%';
        if ($garden) {
          var plant = percent === 100 ? '🌳' : percent >= 75 ? '🌸' : percent >= 50 ? '🌷' : percent >= 25 ? '🌿' : '🌱';
          $garden.textContent = plant + ' ' + percent + '%';
        }
        if ($badge) {
          if (percent === 100) {
            $badge.textContent = '🏅 Tout est fait aujourd\'hui !';
          } else {
            var has7 = goals.some(function(g){ return g.streak >= 7; });
            $badge.textContent = has7 ? '🏅 Badge "Constance" : 7 jours !' : 'Aucun badge pour l\'instant.';
          }
        }
      })
      .catch(function(){
        if ($goals) {
          while ($goals.firstChild) $goals.removeChild($goals.firstChild);
          $goals.appendChild(
            el('div', { class: 'card' }, [
              el('p', { class: 'muted' }, ['Impossible de joindre le serveur 😕'])
            ])
          );
        }
      });
  };
})(window.Bloom);
