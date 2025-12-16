// ============================================
// CONSCIOUS CARDS - JOURNEYS PAGE
// ============================================

class JourneysApp {
  constructor() {
    this.allCards = [];
    this.themes = {}; // Stores theme -> array of cards
    this.currentTheme = null;

    this.init();
  }

  async init() {
    console.log("🚀 Initializing Journeys App...");
    try {
      await this.loadCardData();
      this.extractThemes();
      this.renderThemes();
      this.renderWordCloud();
      this.setupThemeEventListeners();
      this.setupViewToggle();
      this.setupThemeToggle(); // Ensure theme toggle works on this page too
    } catch (error) {
      console.error("Error initializing Journeys App:", error);
      this.showError("Failed to load journeys data. Please refresh.");
    }
  }

  async loadCardData() {
    try {
      const response = await fetch('conscious_cards_expanded2.json'); // Updated path
      if (!response.ok) throw new Error('Failed to load card data');
      this.allCards = await response.json();
      console.log(`✅ Loaded ${this.allCards.length} cards for journeys.`);
    } catch (error) {
      console.error('Error loading cards:', error);
      throw error;
    }
  }

  extractThemes() {
    this.allCards.forEach(card => {
      if (card.Theme_Tags && Array.isArray(card.Theme_Tags)) {
        card.Theme_Tags.forEach(theme => {
          const normalizedTheme = theme.trim();
          if (normalizedTheme) {
            if (!this.themes[normalizedTheme]) {
              this.themes[normalizedTheme] = [];
            }
            this.themes[normalizedTheme].push(card);
          }
        });
      }
    });
    console.log(`✅ Found ${Object.keys(this.themes).length} unique themes.`);
  }

  renderThemes() {
    const themeGrid = document.getElementById('theme-grid');
    if (!themeGrid) return;

    themeGrid.innerHTML = ''; // Clear loading message

    // Get all themes with more than 5 cards
    const eligibleThemes = Object.entries(this.themes)
      .filter(([, cards]) => Array.isArray(cards) && cards.length > 5)
      .map(([theme, cards]) => ({
        name: theme,
        count: cards.length,
        // Get a random card from this theme for the preview
        previewCard: cards[Math.floor(Math.random() * cards.length)]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Add a special featured theme (first one)
    const featuredTheme = eligibleThemes[0];
    if (featuredTheme) {
      const featuredCard = document.createElement('div');
      featuredCard.className = 'theme-card featured-theme';
      featuredCard.dataset.theme = featuredTheme.name;
      
      featuredCard.innerHTML = `
        <div class="theme-card-content">
          <div class="theme-card-badge">✨ Featured</div>
          <h3 class="theme-card-title">${featuredTheme.name}</h3>
          <p class="theme-card-description">${featuredTheme.previewCard?.Description?.substring(0, 120) || 'Start your journey with this featured theme'}</p>
          <div class="theme-card-footer">
            <span class="theme-card-count">${featuredTheme.count} cards</span>
            <button class="theme-card-button">Begin Journey</button>
          </div>
        </div>
      `;
      themeGrid.appendChild(featuredCard);
    }

    // Add remaining themes
    eligibleThemes.slice(1).forEach((theme) => {
      const themeCard = document.createElement('div');
      themeCard.className = 'theme-card';
      themeCard.dataset.theme = theme.name;

      themeCard.innerHTML = `
        <div class="theme-card-content">
          <h3 class="theme-card-title">${theme.name}</h3>
          <p class="theme-card-description">${theme.previewCard?.Description?.substring(0, 80) || 'Explore this theme'}</p>
          <div class="theme-card-footer">
            <span class="theme-card-count">${theme.count} cards</span>
            <button class="theme-card-button">View</button>
          </div>
        </div>
      `;
      themeGrid.appendChild(themeCard);
    });
  }

  renderWordCloud() {
    const container = document.getElementById('word-cloud-container');
    if (!container) return;

    container.innerHTML = '';

    // Build an array of { theme, count } and filter >5
    const themeCounts = Object.entries(this.themes)
      .map(([theme, cards]) => ({ theme, count: (cards || []).length }))
      .filter((t) => t.count > 5);

    if (themeCounts.length === 0) {
      container.innerHTML = '<p>No themes to display yet.</p>';
      return;
    }

    const counts = themeCounts.map(t => t.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    const scaleFont = (c) => {
      if (max === min) return 1.2; // uniform sizing if all equal
      const t = (c - min) / (max - min);
      return 0.9 + t * 1.6; // 0.9rem -> 2.5rem range
    };

    themeCounts.forEach(({ theme, count }) => {
      const span = document.createElement('span');
      span.className = 'word-cloud-item';
      span.style.fontSize = `${scaleFont(count)}rem`;
      span.title = `${theme} • ${count} cards`;
      span.textContent = theme;
      span.addEventListener('click', () => this.displayJourney(theme));
      container.appendChild(span);
    });
  }

  setupViewToggle() {
    const toggleBtn = document.getElementById('view-toggle');
    const themeGrid = document.getElementById('theme-grid');
    const wordCloud = document.getElementById('word-cloud-container');
    if (!toggleBtn || !themeGrid || !wordCloud) return;

    const setMode = (mode) => {
      if (mode === 'cloud') {
        themeGrid.classList.add('hidden');
        wordCloud.classList.remove('hidden');
        toggleBtn.textContent = 'Switch to Grid';
        toggleBtn.setAttribute('aria-pressed', 'true');
      } else {
        wordCloud.classList.add('hidden');
        themeGrid.classList.remove('hidden');
        toggleBtn.textContent = 'Switch to Word Cloud';
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
    };

    // default to grid
    setMode('grid');

    toggleBtn.addEventListener('click', () => {
      const isGridHidden = themeGrid.classList.contains('hidden');
      setMode(isGridHidden ? 'grid' : 'cloud');
    });
  }

  setupThemeEventListeners() {
    const themeGrid = document.getElementById('theme-grid');
    if (themeGrid) {
      themeGrid.addEventListener('click', (event) => {
        const themeCard = event.target.closest('.theme-card');
        if (themeCard) {
          const themeName = themeCard.dataset.theme;
          this.displayJourney(themeName);
        }
      });
    }
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  }

  displayJourney(themeName) {
    this.currentTheme = themeName;
    const cardsForTheme = this.themes[themeName] || [];

    const journeyDetailSection = document.getElementById('journey-detail-section');
    const themeTitle = document.getElementById('journey-theme-title');
    const themeDescription = document.getElementById('journey-theme-description');
    const journeyCardList = document.getElementById('journey-card-list');
    const themeGrid = document.getElementById('theme-grid');

    if (!journeyDetailSection || !themeTitle || !themeDescription || !journeyCardList || !themeGrid) return;

    themeTitle.textContent = themeName;
    themeDescription.textContent = `Embark on a journey of ${themeName}. Discover prompts designed to deepen your understanding and practice in this area.`;

    journeyCardList.innerHTML = ''; // Clear previous cards

    if (cardsForTheme.length === 0) {
      journeyCardList.innerHTML = '<p>No cards found for this theme yet. Check back soon!</p>';
    } else {
      const shuffledCards = this.shuffleArray(cardsForTheme);
      shuffledCards.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('journey-card-item');
        // Store card concept or data if needed for further interaction
        cardItem.dataset.cardConcept = card.Concept; 

        cardItem.innerHTML = `
          <h3>${card.Concept}</h3>
          <p>${card['Journal Prompt'].substring(0, 150)}...</p>
          <small>Tags: ${card.Theme_Tags.join(', ')}</small>
        `;
        // Optional: Add click handler to view card details or prompt
        cardItem.addEventListener('click', () => this.viewCardDetails(card)); 
        journeyCardList.appendChild(cardItem);
      });
    }

    // Toggle visibility of sections
    themeGrid.style.display = 'none';
    journeyDetailSection.classList.remove('hidden');
    
    // Update URL to reflect the selected theme (optional but good for shareability)
    const newUrl = `${window.location.origin}${window.location.pathname}#theme=${encodeURIComponent(themeName)}`;
    window.history.pushState({ theme: themeName }, '', newUrl);
  }

  viewCardDetails(card) {
    // This is a placeholder. We could:
    // 1. Navigate to index.html with a URL parameter like ?card=<Concept>
    // 2. Display card details directly within this page (more complex)
    // For now, let's navigate to index.html and open the card.
    window.location.href = `index.html?card=${encodeURIComponent(card.Concept)}`;
  }

  // --- Utility Functions ---
  
  getDateString(date = new Date()) {
    return date.toISOString().split("T")[0];
  }

  showMessage(message) {
    const messageEl = document.createElement("div");
    messageEl.className = "toast-message";
    messageEl.textContent = message;
    messageEl.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-full);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: fadeInUp 0.3s ease;
        `;
    document.body.appendChild(messageEl);
    setTimeout(() => {
      messageEl.style.animation = "fadeOut 0.3s ease reverse"; // Using fadeOut for removal
      setTimeout(() => messageEl.remove(), 300);
    }, 2000);
  }

  showError(message) {
    console.error(message);
    this.showMessage(message);
  }
  
  setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
}

// ============================================
// INITIALIZE JOURNEYS APP
// ============================================

let journeysApp;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    journeysApp = new JourneysApp();
  });
} else {
  journeysApp = new JourneysApp();
}

// ============================================
// INITIALIZE APP
// ============================================


