// main.js — app state, screen routing, input syncing

const appState = {
  card: { recipientName: "", senderName: "", message: "" },
  messageHelper: { tone: "sweet", details: "", generatedDraft: "" },
  selectedGame: "balloons",
  progress: { completed: false, score: 0, maxScore: 0 },
  currentScreen: "builder",
  activeGameId: null,
};

// ---- SCREEN SWITCHING ----
function showScreen(screenName) {
  appState.currentScreen = screenName;
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("is-active"));
  document.getElementById(screenName + "-screen").classList.add("is-active");
  window.scrollTo(0, 0);
}

// ---- GAME THEME ----
function applyGameTheme(themeClass) {
  const gs = document.getElementById("game-screen");
  // remove all theme classes
  Object.values(GAME_REGISTRY).forEach((g) =>
    gs.classList.remove(g.themeClass),
  );
  if (themeClass) gs.classList.add(themeClass);
  gs.style.background = "var(--game-bg)";
}

function clearGameTheme() {
  const gs = document.getElementById("game-screen");
  Object.values(GAME_REGISTRY).forEach((g) =>
    gs.classList.remove(g.themeClass),
  );
}

// ---- LIVE PREVIEW ----
function updateLivePreview() {
  const r = appState.card.recipientName || "someone special";
  const s = appState.card.senderName || "you";
  const m =
    appState.card.message || "Your message will appear here as you write.";
  const g = GAME_REGISTRY[appState.selectedGame];

  document.getElementById("prev-recipient").textContent = r;
  document.getElementById("prev-recipient2").textContent = r;
  document.getElementById("prev-sender").textContent = s;
  document.getElementById("prev-message").textContent = m;
  document.getElementById("prev-game").textContent = g
    ? g.title + " " + g.emoji
    : "";
}

// ---- GAME PICKER ----
function renderGamePicker() {
  const picker = document.getElementById("game-picker");
  picker.innerHTML = "";
  Object.values(GAME_REGISTRY).forEach((game) => {
    const card = document.createElement("div");
    card.className =
      "game-card" + (game.id === appState.selectedGame ? " is-selected" : "");
    card.innerHTML = `
      <div class="game-card-preview preview-${game.previewType}">${renderGamePreview(game.previewType)}</div>
      <span class="game-card-emoji">${game.emoji}</span>
      <div class="game-card-title">${game.title}</div>
      <div class="game-card-desc">${game.description}</div>
      <div class="game-card-action">${game.actionLabel}</div>
      <span class="selected-pill">Selected ✓</span>
    `;
    card.addEventListener("click", () => {
      appState.selectedGame = game.id;
      renderGamePicker();
      updateLivePreview();
    });
    picker.appendChild(card);
  });
}

// ---- VALIDATION ----
function validateBuilder() {
  const errors = [];
  if (!appState.card.recipientName.trim())
    errors.push("Add the recipient's name.");
  if (!appState.card.senderName.trim()) errors.push("Add your name.");
  if (!appState.card.message.trim())
    errors.push("Write a message or create a starter draft.");
  if (!appState.selectedGame) errors.push("Choose one mini game.");
  return errors;
}

// ---- INPUT SYNCING ----
function bindInputs() {
  const recipientInput = document.getElementById("recipient-input");
  const senderInput = document.getElementById("sender-input");
  const messageInput = document.getElementById("message-input");

  recipientInput.addEventListener("input", () => {
    appState.card.recipientName = recipientInput.value;
    updateLivePreview();
  });
  senderInput.addEventListener("input", () => {
    appState.card.senderName = senderInput.value;
    updateLivePreview();
  });
  messageInput.addEventListener("input", () => {
    appState.card.message = messageInput.value;
    updateLivePreview();
  });

  // Message helper
  const helperToggle = document.getElementById("helper-toggle");
  const helperPanel = document.getElementById("message-helper");
  helperToggle.addEventListener("click", () => {
    helperPanel.classList.toggle("is-open");
  });

  document.querySelectorAll(".tone-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tone-btn")
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      appState.messageHelper.tone = btn.dataset.tone;
    });
  });

  document.getElementById("helper-generate").addEventListener("click", () => {
    const draft = generateMessageDraft({
      recipientName: appState.card.recipientName,
      senderName: appState.card.senderName,
      tone: appState.messageHelper.tone,
      details: document.getElementById("helper-detail").value,
    });
    messageInput.value = draft;
    appState.card.message = draft;
    helperPanel.classList.remove("is-open");
    updateLivePreview();
  });
}

// ---- CREATE CARD ----
function bindCreateButton() {
  document.getElementById("create-btn").addEventListener("click", () => {
    const errors = validateBuilder();
    const errEl = document.getElementById("validation-errors");
    if (errors.length) {
      errEl.innerHTML = errors.map((e) => `<p>⚠ ${e}</p>`).join("");
      return;
    }
    errEl.innerHTML = "";
    renderPreviewScreen();
    showScreen("preview");
  });
}

// ---- PREVIEW SCREEN ----
function renderPreviewScreen() {
  document.getElementById("intro-recipient").textContent =
    appState.card.recipientName;
  document.getElementById("intro-sender").textContent =
    appState.card.senderName;

  const game = GAME_REGISTRY[appState.selectedGame];
  document.getElementById("intro-game-card").innerHTML = `
    <div class="game-info-emoji">${game.emoji}</div>
    <div class="game-info-title">${game.title}</div>
    <div class="game-info-desc">${game.description}</div>
    <div class="game-info-action">${game.actionLabel}</div>
  `;
}

function bindPreviewScreen() {
  document.getElementById("start-game-btn").addEventListener("click", () => {
    startSelectedGame();
    showScreen("game");
  });
  document.getElementById("edit-card-btn").addEventListener("click", () => {
    showScreen("builder");
  });
}

// ---- START GAME ----
function startSelectedGame() {
  const game = GAME_REGISTRY[appState.selectedGame];
  if (!game) return;
  appState.activeGameId = game.id;

  applyGameTheme(game.themeClass);

  document.getElementById("game-title-area").innerHTML =
    `Playing: <strong>${game.emoji} ${game.title}</strong>`;

  const container = document.getElementById("game-container");
  container.innerHTML = "";

  game.start(container, (result) => {
    appState.progress.score = result.score;
    appState.progress.maxScore = result.maxScore;
    appState.progress.completed = true;
    clearGameTheme();
    showScreen("unlock");
  });
}

// ---- UNLOCK SCREEN ----
function bindUnlockScreen() {
  document.getElementById("open-letter-btn").addEventListener("click", () => {
    renderLetter();
    showScreen("letter");
  });
}

// ---- LETTER SCREEN ----
function renderLetter() {
  document.getElementById("letter-recipient").textContent =
    appState.card.recipientName;
  document.getElementById("letter-body").textContent = appState.card.message;
  document.getElementById("letter-sender").textContent =
    appState.card.senderName;
}

function bindLetterScreen() {
  document
    .getElementById("letter-continue-btn")
    .addEventListener("click", () => {
      showScreen("ending");
    });
}

// ---- ENDING SCREEN ----
function bindEndingScreen() {
  document.getElementById("read-again-btn").addEventListener("click", () => {
    renderLetter();
    showScreen("letter");
  });
  document.getElementById("play-again-btn").addEventListener("click", () => {
    renderPreviewScreen();
    showScreen("preview");
  });
  document.getElementById("new-card-btn").addEventListener("click", () => {
    // reset state
    appState.card = { recipientName: "", senderName: "", message: "" };
    appState.selectedGame = "balloons";
    appState.progress = { completed: false, score: 0, maxScore: 0 };
    document.getElementById("recipient-input").value = "";
    document.getElementById("sender-input").value = "";
    document.getElementById("message-input").value = "";
    document.getElementById("validation-errors").innerHTML = "";
    renderGamePicker();
    updateLivePreview();
    showScreen("builder");
  });
}

// ---- INIT ----
function init() {
  renderGamePicker();
  updateLivePreview();
  bindInputs();
  bindCreateButton();
  bindPreviewScreen();
  bindUnlockScreen();
  bindLetterScreen();
  bindEndingScreen();
}

document.addEventListener("DOMContentLoaded", init);
