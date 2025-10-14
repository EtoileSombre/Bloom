// Starter MiniLearn Bloom à peaufiner
const $ = (s, el=document) => el.querySelector(s);
const storage = {
  get:(k,f=null)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(f)),
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};

const K_GOALS='bloom.goals.v1', K_LOGS='bloom.logs.v1', K_THEME='bloom.theme.v1';
const $goals=$('#goals'), $form=$('#goalForm'), $title=$('#goalTitle');
const $garden=$('#gardenView'), $bar=$('#progressBar'), $badge=$('#badgeInfo'), $theme=$('#themeToggle');

// Thème
(function(){
  const t=storage.get(K_THEME,'dark');
  document.documentElement.classList.toggle('light', t==='light');
  $theme.setAttribute('aria-pressed', String(t==='light'));
})();
$theme.addEventListener('click',()=>{
  const mode=document.documentElement.classList.toggle('light')?'light':'dark';
  storage.set(K_THEME,mode);
  $theme.setAttribute('aria-pressed', String(mode==='light'));
});

// Seed si vide
if(!storage.get(K_GOALS)) storage.set(K_GOALS, [
  {id:crypto.randomUUID(),title:'10 min d’anglais',icon:'📚',createdAt:Date.now(),streak:0},
  {id:crypto.randomUUID(),title:'Respiration 3 min',icon:'🌱',createdAt:Date.now(),streak:0}
]);
if(!storage.get(K_LOGS)) storage.set(K_LOGS, {});

// Helpers
const todayISO = () => new Date().toISOString().slice(0,10);

// Rendu
function render(){
  const goals = storage.get(K_GOALS, []);
  const logs = storage.get(K_LOGS, {});
  const done = new Set(logs[todayISO()]||[]);
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
  $badge.textContent = goals.some(g=>(g.streak||0)>=7) ? '🏅 Badge “Constante” : 7 jours !' : 'Aucun badge pour l’instant.';
}

// Interactions
$goals.addEventListener('click',(e)=>{
  const card = e.target.closest('.card'); if(!card) return;
  if(e.target.matches('.toggle')){
    const id = card.dataset.id;
    const logs = storage.get(K_LOGS,{});
    const k = todayISO();
    const set = new Set(logs[k]||[]);
    e.target.checked ? set.add(id) : set.delete(id);
    logs[k] = [...set]; storage.set(K_LOGS, logs);
    render();
  }
});

$form.addEventListener('submit',(e)=>{
  e.preventDefault();
  const fd = new FormData($form);
  const title = String(fd.get('title')||'').trim();
  const icon = String(fd.get('icon')||'🌱');
  if(!title) return;
  const goals = storage.get(K_GOALS, []);
  goals.push({id:crypto.randomUUID(), title, icon, createdAt:Date.now(), streak:0});
  storage.set(K_GOALS, goals);
  $title.value='';
  render();
});

// Boot
render();
