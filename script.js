// Variables globales
let habits = [];
let currentTheme = 'light';

// Emojis de plantes pour le jardin
const plantEmojis = ['🌱', '🌿', '🌾', '🌵', '🌴', '🌳', '🌲', '🍀', '🌻', '🌺', '🌸', '🌼', '🌷', '🥀', '🏵️'];

// Badges configuration
const badgesConfig = {
    beginner: { days: 3, name: 'Débutant', icon: '🌱' },
    consistent: { days: 7, name: 'Constant', icon: '🌿' },
    dedicated: { days: 14, name: 'Dévoué', icon: '🌳' },
    master: { days: 30, name: 'Maître', icon: '🌸' }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    renderHabits();
    renderGarden();
    updateBadges();
    checkDailyReset();
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    document.getElementById('add-habit-btn').addEventListener('click', addHabit);
    document.getElementById('habit-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addHabit();
    });
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

// Gestion du thème
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.querySelector('.theme-icon').textContent = currentTheme === 'light' ? '🌙' : '☀️';
    localStorage.setItem('theme', currentTheme);
}

// Charger les données depuis localStorage
function loadData() {
    const savedHabits = localStorage.getItem('habits');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    }
    
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        document.querySelector('.theme-icon').textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Sauvegarder les données dans localStorage
function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Ajouter un objectif
function addHabit() {
    const input = document.getElementById('habit-input');
    const habitName = input.value.trim();
    
    if (habitName === '') {
        alert('Veuillez entrer un objectif!');
        return;
    }
    
    const habit = {
        id: Date.now(),
        name: habitName,
        createdAt: new Date().toISOString(),
        completedDates: [],
        streak: 0,
        bestStreak: 0
    };
    
    habits.push(habit);
    saveData();
    input.value = '';
    renderHabits();
    renderGarden();
}

// Supprimer un objectif
function deleteHabit(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif?')) {
        habits = habits.filter(h => h.id !== id);
        saveData();
        renderHabits();
        renderGarden();
        updateBadges();
    }
}

// Basculer l'état de complétion d'un objectif
function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    const today = getTodayString();
    const index = habit.completedDates.indexOf(today);
    
    if (index === -1) {
        habit.completedDates.push(today);
        calculateStreak(habit);
    } else {
        habit.completedDates.splice(index, 1);
        calculateStreak(habit);
    }
    
    saveData();
    renderHabits();
    renderGarden();
    updateBadges();
}

// Calculer la série de jours consécutifs
function calculateStreak(habit) {
    if (habit.completedDates.length === 0) {
        habit.streak = 0;
        return;
    }
    
    const sortedDates = habit.completedDates
        .map(d => new Date(d))
        .sort((a, b) => b - a);
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Vérifier si complété aujourd'hui ou hier
    const lastDate = sortedDates[0];
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
        habit.streak = 0;
        return;
    }
    
    // Compter les jours consécutifs
    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = sortedDates[i];
        const prevDate = sortedDates[i - 1];
        const diff = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }
    
    habit.streak = streak;
    habit.bestStreak = Math.max(habit.bestStreak || 0, streak);
}

// Obtenir la date du jour sous forme de string
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Vérifier si c'est un nouveau jour et réinitialiser si nécessaire
function checkDailyReset() {
    const lastCheck = localStorage.getItem('lastCheck');
    const today = getTodayString();
    
    if (lastCheck !== today) {
        // Recalculer les séries pour tous les objectifs
        habits.forEach(habit => calculateStreak(habit));
        saveData();
        localStorage.setItem('lastCheck', today);
    }
}

// Afficher les objectifs
function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    
    if (habits.length === 0) {
        habitsList.innerHTML = '<p class="empty-message">Aucun objectif pour le moment. Ajoutez-en un!</p>';
        return;
    }
    
    habitsList.innerHTML = '';
    const today = getTodayString();
    
    habits.forEach(habit => {
        const isCompleted = habit.completedDates.includes(today);
        
        const habitItem = document.createElement('div');
        habitItem.className = `habit-item ${isCompleted ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'habit-checkbox';
        checkbox.checked = isCompleted;
        checkbox.addEventListener('change', () => toggleHabit(habit.id));
        
        const content = document.createElement('div');
        content.className = 'habit-content';
        
        const name = document.createElement('div');
        name.className = 'habit-name';
        name.textContent = habit.name;
        
        const streak = document.createElement('div');
        streak.className = `habit-streak ${habit.streak > 0 ? 'active' : ''}`;
        streak.textContent = habit.streak > 0 
            ? `🔥 Série: ${habit.streak} jour${habit.streak > 1 ? 's' : ''} | Meilleure: ${habit.bestStreak}` 
            : `Total: ${habit.completedDates.length} jour${habit.completedDates.length > 1 ? 's' : ''}`;
        
        content.appendChild(name);
        content.appendChild(streak);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '🗑️ Supprimer';
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));
        
        habitItem.appendChild(checkbox);
        habitItem.appendChild(content);
        habitItem.appendChild(deleteBtn);
        
        habitsList.appendChild(habitItem);
    });
}

// Afficher le jardin
function renderGarden() {
    const garden = document.getElementById('garden');
    const today = getTodayString();
    
    // Compter les objectifs complétés aujourd'hui
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    
    // Compter le total de complétions
    const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
    
    // Mettre à jour les statistiques
    document.getElementById('plants-count').textContent = totalCompletions;
    
    const completionRate = habits.length > 0 
        ? Math.round((completedToday / habits.length) * 100) 
        : 0;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
    
    // Afficher les plantes
    if (totalCompletions === 0) {
        garden.innerHTML = '<div class="garden-message">Ajoutez des objectifs pour faire pousser votre jardin!</div>';
        return;
    }
    
    garden.innerHTML = '';
    
    // Créer une plante pour chaque complétion (limité à 50 pour la performance)
    const plantsToShow = Math.min(totalCompletions, 50);
    for (let i = 0; i < plantsToShow; i++) {
        const plant = document.createElement('div');
        plant.className = 'plant';
        plant.textContent = plantEmojis[i % plantEmojis.length];
        plant.title = `Plante ${i + 1}`;
        garden.appendChild(plant);
    }
}

// Mettre à jour les badges
function updateBadges() {
    // Trouver la meilleure série actuelle
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    
    Object.keys(badgesConfig).forEach(badgeKey => {
        const badge = badgesConfig[badgeKey];
        const badgeElement = document.querySelector(`.badge[data-badge="${badgeKey}"]`);
        
        if (maxStreak >= badge.days) {
            badgeElement.classList.remove('locked');
            badgeElement.classList.add('unlocked');
        } else {
            badgeElement.classList.remove('unlocked');
            badgeElement.classList.add('locked');
        }
    });
}

// Fonction utilitaire pour déboguer (peut être supprimée en production)
function debugInfo() {
    console.log('Habits:', habits);
    console.log('Current Theme:', currentTheme);
    console.log('Today:', getTodayString());
}

// Exposer debugInfo pour le débogage dans la console
window.debugInfo = debugInfo;
