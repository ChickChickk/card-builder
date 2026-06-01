// complimentCollectorGame.js — Compliment Collector mini game

function startComplimentCollectorGame(container, onComplete) {
  const COMPLIMENTS = [
    "You radiate warmth",
    "Genuinely inspiring",
    "Such a good listener",
    "Unstoppably kind",
    "Makes everyone smile",
    "Quietly brilliant",
    "You show up fully",
    "Deeply thoughtful",
    "Effortlessly cool",
    "The best kind of chaos",
    "Thoughtful beyond words",
    "Impossibly lovable",
    "Brave in quiet ways",
    "A light in the room",
    "Wonderfully you",
  ];

  const TARGET = 8;
  let collected = [];
  let running = true;
  let interval = null;
  let itemId = 0;

  container.innerHTML = `
    <div class="compliments-arena">
      <div class="game-hud" style="justify-content:center">
        <span>Collected: <strong id="comp-score">0</strong>/${TARGET}</span>
      </div>
      <p class="game-instruction">Click the kind words floating by to collect them!</p>
      <div class="compliment-stream" id="comp-stream"></div>
      <div class="collected-cheers" id="comp-cheers"></div>
    </div>
  `;

  const stream = container.querySelector("#comp-stream");
  const cheers = container.querySelector("#comp-cheers");
  const scoreEl = container.querySelector("#comp-score");

  function spawnCompliment() {
    if (!running) return;
    const text = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    if (collected.includes(text)) return;
    const id = itemId++;
    const dur = 4 + Math.random() * 3;
    const top = 20 + Math.random() * 60;

    const el = document.createElement("div");
    el.className = "floating-compliment";
    el.id = "comp-" + id;
    el.style.cssText = `top:${top}%; animation-duration:${dur}s; animation-name:floatCompliment;`;
    el.textContent = text;
    stream.appendChild(el);

    el.addEventListener("click", () => {
      if (collected.includes(text) || !running) return;
      el.classList.add("collected");
      el.style.animation = "collectBurst 0.4s ease-out forwards";
      collected.push(text);
      scoreEl.textContent = collected.length;

      const pill = document.createElement("div");
      pill.className = "cheer-pill";
      pill.textContent = text;
      cheers.appendChild(pill);

      setTimeout(() => el.remove(), 400);
      if (collected.length >= TARGET) endGame();
    });

    setTimeout(() => {
      document.getElementById("comp-" + id)?.remove();
    }, dur * 1000);
  }

  function endGame() {
    running = false;
    clearInterval(interval);
    stream.querySelectorAll(".floating-compliment").forEach((e) => e.remove());
    container.querySelector(".game-instruction").textContent =
      "💖 Your collection is complete!";
    setTimeout(
      () =>
        onComplete({ score: collected.length, maxScore: TARGET, passed: true }),
      1000,
    );
  }

  spawnCompliment();
  interval = setInterval(() => {
    if (running) spawnCompliment();
  }, 1100);

  setTimeout(() => {
    if (running) endGame();
  }, 35000);
}
