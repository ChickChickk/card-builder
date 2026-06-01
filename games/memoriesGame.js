// memoriesGame.js — Memory Lane mini game

function startMemoriesGame(container, onComplete) {
  const GOOD = ["🌟", "💌", "🎉", "🥂", "🌸", "💛", "🏆", "🎊", "✨", "🌈"];
  const BAD = ["😰", "💤", "📋", "🕐", "😬"];
  const TARGET = 10;
  let score = 0;
  let missed = 0;
  let running = true;
  let itemId = 0;
  let interval = null;

  container.innerHTML = `
    <div class="game-hud">
      <span>Caught: <strong id="mem-score">0</strong>/${TARGET}</span>
    </div>
    <p class="game-instruction">Catch the good memories — tap them before they slip away!</p>
    <div class="memories-arena" id="memories-arena"></div>
  `;

  const arena = container.querySelector("#memories-arena");
  const scoreEl = container.querySelector("#mem-score");

  function spawnItem() {
    if (!running) return;
    const isGood = Math.random() > 0.3;
    const emoji = isGood
      ? GOOD[Math.floor(Math.random() * GOOD.length)]
      : BAD[Math.floor(Math.random() * BAD.length)];
    const id = itemId++;
    const left = 5 + Math.random() * 85;
    const duration = 2.5 + Math.random() * 2;

    const el = document.createElement("div");
    el.className = "memory-item";
    el.id = "mem-" + id;
    el.style.cssText = `left:${left}%; animation-duration:${duration}s; animation-name:fallDown;`;
    el.textContent = emoji;
    arena.appendChild(el);

    el.addEventListener("click", () => {
      if (el.classList.contains("caught") || !running) return;
      el.classList.add("caught");
      el.style.animation = "catchPop 0.4s ease-out forwards";
      if (isGood) {
        score++;
        scoreEl.textContent = score;
        if (score >= TARGET) endGame();
      }
      setTimeout(() => el.remove(), 400);
    });

    setTimeout(() => {
      if (!running) return;
      document.getElementById("mem-" + id)?.remove();
    }, duration * 1000);
  }

  function endGame() {
    running = false;
    clearInterval(interval);
    arena.querySelectorAll(".memory-item").forEach((i) => i.remove());
    container.querySelector(".game-instruction").textContent =
      "🌟 You caught all the good stuff!";
    setTimeout(
      () => onComplete({ score, maxScore: TARGET, passed: true }),
      900,
    );
  }

  spawnItem();
  interval = setInterval(() => {
    if (running) spawnItem();
  }, 900);

  // auto-complete after 30s
  setTimeout(() => {
    if (running) endGame();
  }, 30000);
}
