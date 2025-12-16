// ============================================
// CONSCIOUS CARDS - MAIN APPLICATION
// ============================================

class ConsciousCards {
  constructor() {
    this.cards = [];
    this.currentCard = null;
    this.currentCardIndex = 0;
    this.favorites = this.loadFavorites();
    this.stats = this.loadStats();
    this.commitments = this.loadCommitments();
    this.cardHistory = this.loadCardHistory();

    this.init();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async init() {
    console.log("🎴 Initializing Conscious Cards...");

    try {
      await this.loadCards();
      this.setupEventListeners();
      this.setupThemeToggle();
      this.displayCardOfTheDay();
      this.updateStats();
      this.checkStreak();
    } catch (error) {
      console.error("Error initializing app:", error);
      this.showError("Failed to load cards. Please refresh the page.");
    }
  }

  // ============================================
  // DATA LOADING
  // ============================================

  async loadCards() {
    try {
      const response = await fetch('./conscious_cards_expanded2.json');
      if (!response.ok) throw new Error('Failed to load cards');
      
      this.cards = await response.json();
      // Filter out empty cards and suggested additions
      this.cards = this.cards.filter(card => 
          card.Concept && 
          card.Concept.trim() !== '' && 
          !card.Concept.includes('SUGGESTED')
      );
      console.log(`✅ Loaded ${this.cards.length} cards`);
    } catch (error) {
      console.error('Error loading cards:', error);
      throw error;
    }
  }

  // ============================================
  // CARD OF THE DAY
  // ============================================

  displayCardOfTheDay() {
    // Check if we already have a card for today
    const today = this.getDateString();
    const savedCardOfDay = localStorage.getItem("cardOfTheDay");
    const savedDate = localStorage.getItem("cardOfTheDayDate");

    let cardToShow;

    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const cardConceptFromUrl = urlParams.get("card");

    if (cardConceptFromUrl) {
      // Show specific card from URL
      cardToShow = this.cards.find(
        (card) =>
          card.Concept &&
          card.Concept.toLowerCase() === cardConceptFromUrl.toLowerCase()
      );
    } else if (savedDate === today && savedCardOfDay) {
      // Show saved card of the day
      cardToShow = this.cards.find((card) => card.Concept === savedCardOfDay);
    }

    if (!cardToShow) {
      // Select new card of the day
      cardToShow = this.selectCardOfTheDay();
      localStorage.setItem("cardOfTheDay", cardToShow.Concept);
      localStorage.setItem("cardOfTheDayDate", today);
    }

    this.currentCard = cardToShow;
    this.displayCard(cardToShow, true);
    this.updateStats();
  }

  selectCardOfTheDay() {
    // Smart selection: avoid recently seen cards
    const recentCards = this.cardHistory.slice(-14); // Last 14 cards
    const availableCards = this.cards.filter(
      (card) => !recentCards.includes(card.Concept)
    );

    const pool = availableCards.length > 0 ? availableCards : this.cards;
    const randomIndex = Math.floor(Math.random() * pool.length);

    return pool[randomIndex];
  }

  // ============================================
  // CARD DISPLAY
  // ============================================

  displayCard(card, isNewCard = false) {
    if (!card) return;

    this.currentCard = card;

    // Update card history
    if (isNewCard && !this.cardHistory.includes(card.Concept)) {
      this.cardHistory.push(card.Concept);
      this.saveCardHistory();

      // Update stats
      this.stats.totalCardsDrawn = (this.stats.totalCardsDrawn || 0) + 1;
      this.stats.lastVisit = new Date().toISOString();
      this.saveStats();
    }

    // Get elements
    const cardElement = document.getElementById("current-card");
    const cardConcept = document.getElementById("card-concept");
    const cardPrompt = document.getElementById("card-prompt");
    const cardConceptBack = document.getElementById("card-concept-back");
    const cardActions = document.getElementById("card-actions");
    const favoriteBtn = document.getElementById("favorite-button");
    const audioContainer = document.getElementById("audio-container");
    const illustrationContainer = document.getElementById("card-illustration");

    // Reset flip state
    cardElement.classList.remove("flipped");

    // Fade out animation
    cardElement.style.opacity = "0";

    setTimeout(() => {
      // Update content
      cardConcept.textContent = card.Concept;
      cardPrompt.textContent = card["Journal Prompt"];
      cardConceptBack.textContent = card.Concept;

      // Update actions
      this.renderActions(card, cardActions);

      // Update favorite button
      this.updateFavoriteButton(card.Concept);

      // Generate stick figure illustration (placeholder for now)
      this.displayIllustration(card.Concept, illustrationContainer);

      // Update URL
      const newUrl = `${window.location.origin}${
        window.location.pathname
      }?card=${encodeURIComponent(card.Concept)}`;
      window.history.replaceState({ path: newUrl }, "", newUrl);

      // Fade in animation
      cardElement.style.opacity = "1";

      // Progressive disclosure
      this.setupProgressiveDisclosure();
    }, 300);
  }

    renderActions(card, container) {
        const actions = [];
        if (card["Action 1 (Internal/Reflective)"]) {
            actions.push({ 
                text: card["Action 1 (Internal/Reflective)"], 
                type: 'internal' 
            });
        }
        if (card["Action 2 (External/Relational)"]) {
            actions.push({ 
                text: card["Action 2 (External/Relational)"], 
                type: 'external' 
            });
        }
        
        container.innerHTML = actions.map((action, index) => `
            <div class="action-item" data-action-index="${index}">
                <div class="action-checkbox" data-action-index="${index}"></div>
                <div class="action-text">
                    <span class="action-icon">${action.type === 'internal' ? '🧘' : '🌍'}</span>
                    ${action.text}
                </div>
            </div>
        `).join('');
        
        // Add click handlers for checkboxes
        container.querySelectorAll('.action-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleActionCommitment(checkbox);
            });
        });
    }

  displayIllustration(concept, container) {
    // List of all available illustration images
    const imageFiles = [
      'Joyful.png',
      '1.png',
      'Untitled-1.png',
      'Untitled-2.png',
      'Untitled-3.png',
      'Untitled-4.png',
      'Untitled-5.png'
    ];
    
    // Use the concept to determine which image to show (consistent for the same concept)
    const imageIndex = Math.abs(this.hashCode(concept)) % imageFiles.length;
    const selectedImage = imageFiles[imageIndex];
    
    // Create the image container
    container.innerHTML = `
      <div class="card-illustration">
        <img 
          src="images/${selectedImage}" 
          alt="${concept} - Conscious Cards" 
          class="card-image" 
          loading="lazy"
        />
      </div>
    `;
  }
  
  // Helper function to create a consistent hash from a string
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // ============================================
  // PROGRESSIVE DISCLOSURE
  // ============================================

  setupProgressiveDisclosure() {
    const promptSection = document.getElementById("prompt-section");
    const actionsSection = document.getElementById("actions-section");
    const showPromptBtn = document.getElementById("show-prompt-btn");
    const showActionsBtn = document.getElementById("show-actions-btn");

    // Make prompt section visible by default
    if (promptSection) {
      promptSection.classList.add("visible");
    }
    // Hide the "Reveal Journal Prompt" button as it's no longer needed
    if (showPromptBtn) {
      showPromptBtn.style.display = "none";
    }

    // Ensure actions button is visible if prompt is visible
    if (showActionsBtn) {
      showActionsBtn.style.display = "inline-flex"; // Make it visible
      // Ensure actions section is hidden until the showActionsBtn is clicked
      if (actionsSection) actionsSection.classList.remove("visible");

      showActionsBtn.onclick = () => {
        if (actionsSection) actionsSection.classList.add("visible");
        showActionsBtn.style.display = "none"; // Hide the button after clicking
      };
    } else {
      // If there's no showActionsBtn, ensure actions section is visible if it exists
      if (actionsSection) actionsSection.classList.add("visible");
    }
  }

  // ============================================
  // FAVORITES
  // ============================================

  toggleFavorite(concept) {
    const index = this.favorites.indexOf(concept);

    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(concept);
    }

    this.saveFavorites();
    this.updateFavoriteButton(concept);
    this.updateStats();
  }

  updateFavoriteButton(concept) {
    const favoriteBtn = document.getElementById("favorite-button");
    if (!favoriteBtn) return;

    const isFavorited = this.favorites.includes(concept);

    if (isFavorited) {
      favoriteBtn.classList.add("favorited");
    } else {
      favoriteBtn.classList.remove("favorited");
    }
  }

  // ============================================
  // ACTION COMMITMENTS
  // ============================================

  toggleActionCommitment(checkbox) {
    const isChecked = checkbox.classList.contains("checked");

    if (isChecked) {
      checkbox.classList.remove("checked");
    } else {
      checkbox.classList.add("checked");
      this.createParticleEffect(checkbox);

      // Save commitment
      const today = this.getDateString();
      if (!this.commitments[today]) {
        this.commitments[today] = [];
      }
      this.commitments[today].push({
        concept: this.currentCard.Concept,
        action: checkbox.dataset.actionIndex,
        timestamp: new Date().toISOString(),
      });
      this.saveCommitments();
    }
  }

  createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const angle = (Math.PI * 2 * i) / 12;
      const distance = 50 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
            `;

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 600);
    }
  }

  // ============================================
  // STATS & TRACKING
  // ============================================

  updateStats() {
    const statsContainer = document.getElementById("stats-container");
    if (!statsContainer) return;

    const streak = this.calculateStreak();
    const totalCards = this.stats.totalCardsDrawn || 0;
    const favoritesCount = this.favorites.length;

    statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${streak} 🔥</div>
                <div class="stat-label">Day Streak</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalCards}</div>
                <div class="stat-label">Cards Drawn</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${favoritesCount}</div>
                <div class="stat-label">Favorites</div>
            </div>
        `;
  }

  calculateStreak() {
    const visits = this.stats.visitDates || [];
    if (visits.length === 0) return 0;

    let streak = 0;
    const today = this.getDateString();
    let checkDate = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = this.getDateString(checkDate);
      if (visits.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  checkStreak() {
    const today = this.getDateString();
    if (!this.stats.visitDates) {
      this.stats.visitDates = [];
    }

    if (!this.stats.visitDates.includes(today)) {
      this.stats.visitDates.push(today);
      this.saveStats();
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  setupEventListeners() {
    // New card button
    const newCardBtn = document.getElementById("new-card-btn");
    if (newCardBtn) {
      newCardBtn.addEventListener("click", () => this.drawNewCard());
    }

    // Share button
    const shareBtn = document.getElementById("share-card-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => this.shareCard());
    }

    // Favorite button
    const favoriteBtn = document.getElementById("favorite-button");
    if (favoriteBtn) {
      favoriteBtn.addEventListener("click", () => {
        if (this.currentCard) {
          this.toggleFavorite(this.currentCard.Concept);
        }
      });
    }

    // Flip buttons
    const flipToBackBtn = document.getElementById("flip-to-back-button");
    const flipToFrontBtn = document.getElementById("flip-to-front-button");
    const cardElement = document.getElementById("current-card");

    if (flipToBackBtn) {
      flipToBackBtn.addEventListener("click", () => {
        cardElement.classList.add("flipped");
      });
    }

    if (flipToFrontBtn) {
      flipToFrontBtn.addEventListener("click", () => {
        cardElement.classList.remove("flipped");
      });
    }

    // Scroll effect for header
    window.addEventListener("scroll", () => {
      const header = document.querySelector(".header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // ============================================
  // ACTIONS
  // ============================================

  drawNewCard() {
    const randomCard = this.selectCardOfTheDay();

    // Update card of the day
    localStorage.setItem("cardOfTheDay", randomCard.Concept);
    localStorage.setItem("cardOfTheDayDate", this.getDateString());

    this.displayCard(randomCard, true);
  }

  shareCard() {
    if (!this.currentCard) return;

    const cardUrl = `${window.location.origin}${
      window.location.pathname
    }?card=${encodeURIComponent(this.currentCard.Concept)}`;

    // Try native share first on mobile
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      navigator
        .share({
          title: `Conscious Cards - ${this.currentCard.Concept}`,
          text: this.currentCard["Journal Prompt"],
          url: cardUrl,
        })
        .catch((err) => {
          // If native share fails or is cancelled, show modal
          this.openShareModal(cardUrl);
        });
    } else {
      // Desktop: show modal
      this.openShareModal(cardUrl);
    }
  }

  openShareModal(cardUrl) {
    const modal = document.getElementById("share-modal");
    const shareInput = document.getElementById("share-link-input");
    const copyBtn = document.getElementById("copy-link-btn");
    const closeBtn = document.getElementById("close-share-modal");
    const overlay = modal.querySelector(".share-modal-overlay");
    const shareButtons = modal.querySelectorAll(".share-option-btn");

    // Set the URL in the input
    shareInput.value = cardUrl;

    // Show modal
    modal.classList.remove("hidden");

    // Copy link handler
    const copyHandler = () => {
      shareInput.select();
      navigator.clipboard.writeText(cardUrl).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    };

    // Close modal handler
    const closeHandler = () => {
      modal.classList.add("hidden");
      copyBtn.removeEventListener("click", copyHandler);
      closeBtn.removeEventListener("click", closeHandler);
      overlay.removeEventListener("click", closeHandler);
      shareButtons.forEach((btn) => {
        btn.removeEventListener("click", shareOptionHandler);
      });
    };

    // Share option handler
    const shareOptionHandler = (e) => {
      const shareType = e.currentTarget.dataset.share;
      const text = encodeURIComponent(
        `Check out this mindfulness prompt: ${this.currentCard.Concept} - ${this.currentCard["Journal Prompt"]}`
      );
      const url = encodeURIComponent(cardUrl);

      let shareUrl;
      switch (shareType) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${encodeURIComponent(
            `Conscious Cards - ${this.currentCard.Concept}`
          )}&body=${text}%0A%0A${url}`;
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    };

    // Add event listeners
    copyBtn.addEventListener("click", copyHandler);
    closeBtn.addEventListener("click", closeHandler);
    overlay.addEventListener("click", closeHandler);
    shareButtons.forEach((btn) => {
      btn.addEventListener("click", shareOptionHandler);
    });

    // Close on Escape key
    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeHandler();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  // ============================================
  // THEME TOGGLE
  // ============================================

  setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

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
      messageEl.style.animation = "fadeIn 0.3s ease reverse";
      setTimeout(() => messageEl.remove(), 300);
    }, 2000);
  }

  showError(message) {
    console.error(message);
    this.showMessage(message);
  }

  // ============================================
  // LOCAL STORAGE
  // ============================================

  loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  }

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  loadStats() {
    try {
      return JSON.parse(localStorage.getItem("stats") || "{}");
    } catch {
      return {};
    }
  }

  saveStats() {
    localStorage.setItem("stats", JSON.stringify(this.stats));
  }

  loadCommitments() {
    try {
      return JSON.parse(localStorage.getItem("commitments") || "{}");
    } catch {
      return {};
    }
  }

  saveCommitments() {
    localStorage.setItem("commitments", JSON.stringify(this.commitments));
  }

  loadCardHistory() {
    try {
      return JSON.parse(localStorage.getItem("cardHistory") || "[]");
    } catch {
      return [];
    }
  }

  saveCardHistory() {
    localStorage.setItem("cardHistory", JSON.stringify(this.cardHistory));
  }
}

// ============================================
// INITIALIZE APP
// ============================================

let app;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    app = new ConsciousCards();
  });
} else {
  app = new ConsciousCards();
}
