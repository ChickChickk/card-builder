// futureBagGame.js — Future Bag mini game

function startFutureBagGame(container, onComplete) {
  const ALL_ITEMS = [
    { emoji: "📚", name: "Curiosity", keep: true },
    { emoji: "🎵", name: "Good music", keep: true },
    { emoji: "☀️", name: "Optimism", keep: true },
    { emoji: "💪", name: "Resilience", keep: true },
    { emoji: "🌱", name: "Growth mindset", keep: true },
    { emoji: "❤️", name: "Self-love", keep: true },
    { emoji: "🗺️", name: "Sense of adventure", keep: true },
    { emoji: "😂", name: "Laughter", keep: true },
    { emoji: "☕", name: "Morning rituals", keep: true },
    { emoji: "🌙", name: "Rest", keep: true },
    { emoji: "🤝", name: "Good people", keep: true },
    { emoji: "🎯", name: "Focus", keep: true },
  ];

  const MIN_PICK = 5;
  let packed = new Set();

  function render() {
    container.innerHTML = `
      <div class="bag-area">
        <div class="bag-visual">🎒</div>
        <p class="bag-count-label">Pack at least ${MIN_PICK} things for the journey ahead</p>
        <div class="items-grid" id="items-grid"></div>
        <button class="bag-done-btn" id="bag-done" ${packed.size < MIN_PICK ? "disabled" : ""}>Pack the bag! →</button>
      </div>
    `;

    const grid = container.querySelector("#items-grid");
    ALL_ITEMS.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "item-card" + (packed.has(item.name) ? " is-packed" : "");
      card.innerHTML = `<div class="item-emoji">${item.emoji}</div><div class="item-name">${item.name}</div>`;
      card.addEventListener("click", () => {
        if (packed.has(item.name)) packed.delete(item.name);
        else packed.add(item.name);
        render();
      });
      grid.appendChild(card);
    });

    container.querySelector("#bag-done").addEventListener("click", () => {
      onComplete({
        score: packed.size,
        maxScore: ALL_ITEMS.length,
        passed: true,
      });
    });
  }

  render();
}
