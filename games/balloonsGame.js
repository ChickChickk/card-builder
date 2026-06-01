// balloonsGame.js — Balloon Pop mini game

function startBalloonsGame(container, onComplete) {
  const BALLOON_COLORS = [
    "#ff8c38",
    "#e84055",
    "#9b59b6",
    "#3498db",
    "#2ecc71",
    "#f1c40f",
    "#e67e22",
  ];
  const BALLOON_EMOJIS = ["🎈", "🎈", "🎈", "⭐", "💫", "✨"];
  const TARGET = 15;
  let score = 0;
  let missed = 0;
  const MAX_MISSED = 5;
  let balloonId = 0;
  let interval = null;
  let running = true;

  container.innerHTML = `
    <div class="game-hud">
      <span>Popped: <strong id="bal-score">0</strong></span>
      <span>Escaped: <strong id="bal-missed">0/${MAX_MISSED}</strong></span>
      <span>Goal: <strong>${TARGET}</strong></span>
    </div>
    <p class="game-instruction">Tap the balloons before they float away!</p>
    <div class="balloon-arena" id="balloon-arena"></div>
  `;

  const arena = container.querySelector("#balloon-arena");
  const scoreEl = container.querySelector("#bal-score");
  const missedEl = container.querySelector("#bal-missed");

  function spawnBalloon() {
    if (!running) return;
    const id = balloonId++;
    const color =
      BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    const emoji =
      BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)];
    const left = 8 + Math.random() * 78;
    const duration = 3 + Math.random() * 2.5;

    const el = document.createElement("div");
    el.className = "balloon";
    el.id = "balloon-" + id;
    el.style.cssText = `left:${left}%; animation-duration:${duration}s; animation-name:floatUp;`;
    el.innerHTML = `<div class="balloon-body" style="background:${color}">${emoji}</div><div class="balloon-string"></div>`;
    arena.appendChild(el);

    el.addEventListener("click", () => {
      if (el.classList.contains("pop") || !running) return;
      el.classList.add("pop");
      el.style.animation = "popAnim 0.3s ease-out forwards";
      score++;
      scoreEl.textContent = score;
      setTimeout(() => el.remove(), 300);
      if (score >= TARGET) endGame(true);
    });

    // balloon escaped
    setTimeout(
      () => {
        if (!running) return;
        if (
          document.getElementById("balloon-" + id) &&
          !document.getElementById("balloon-" + id).classList.contains("pop")
        ) {
          missed++;
          missedEl.textContent = `${missed}/${MAX_MISSED}`;
          document.getElementById("balloon-" + id)?.remove();
          if (missed >= MAX_MISSED) endGame(score >= 8);
        }
      },
      (duration - 0.2) * 1000,
    );
  }

  function endGame(passed) {
    running = false;
    clearInterval(interval);
    // clear all balloons
    arena.querySelectorAll(".balloon").forEach((b) => b.remove());
    container.innerHTML += `<div style="text-align:center;margin-top:24px;font-size:16px;color:var(--text-mid)">
      ${passed ? "🎉 You popped enough balloons!" : "😅 Some got away, but the card is still yours!"}
    </div>`;
    setTimeout(
      () => onComplete({ score, maxScore: TARGET, passed: true }),
      1200,
    );
  }

  // spawn balloons gradually
  spawnBalloon();
  interval = setInterval(() => {
    if (running) spawnBalloon();
  }, 1200);
}
