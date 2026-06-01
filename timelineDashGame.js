// timelineDashGame.js — Timeline Dash mini game

function startTimelineDashGame(container, onComplete) {
  const MILESTONES = [
    "Start",
    "Studied hard",
    "Pulled all-nighters",
    "Made great friends",
    "Almost gave up",
    "Kept going",
    "Almost there",
    "🎓 Done!",
  ];
  const COLLECTIBLES = ["⭐", "💡", "💪", "🎵", "📖", "☀️"];
  const OBSTACLES = ["😓", "📋", "⏰", "🌧️"];
  const TARGET_DIST = 120; // "meters" to run

  let dist = 0;
  let collected = 0;
  let isJumping = false;
  let runInterval = null;
  let spawnInterval = null;
  let running = true;
  let itemId = 0;

  container.innerHTML = `
    <div class="timeline-game-wrap">
      <div class="game-hud">
        <span>Progress: <strong id="tl-dist">0</strong>/${TARGET_DIST}m</span>
        <span>Stars: <strong id="tl-collected">0</strong></span>
      </div>
      <p class="game-instruction">Jump over obstacles and collect stars on the way to graduation day!</p>
      <div class="timeline-track" id="tl-track">
        <div class="timeline-ground"></div>
        <div class="timeline-runner" id="tl-runner">🏃‍♀️‍➡️</div>
      </div>
      <p class="timeline-milestone" id="tl-milestone">Starting the journey…</p>
      <button class="jump-btn" id="jump-btn">Jump! 🦘</button>
    </div>
  `;

  const track = container.querySelector("#tl-track");
  const runner = container.querySelector("#tl-runner");
  const distEl = container.querySelector("#tl-dist");
  const colEl = container.querySelector("#tl-collected");
  const msEl = container.querySelector("#tl-milestone");
  const jumpBtn = container.querySelector("#jump-btn");

  function jump() {
    if (isJumping || !running) return;
    isJumping = true;
    runner.style.bottom = "110px";
    setTimeout(() => {
      runner.style.bottom = "40px";
      isJumping = false;
    }, 500);
  }

  jumpBtn.addEventListener("click", jump);
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      jump();
    }
  });

  function spawnItem() {
    if (!running) return;
    const isObs = Math.random() > 0.55;
    const emoji = isObs
      ? OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)]
      : COLLECTIBLES[Math.floor(Math.random() * COLLECTIBLES.length)];
    const id = itemId++;
    const dur = 2.5 + Math.random() * 1;

    const el = document.createElement("div");
    el.className = isObs ? "timeline-obstacle" : "timeline-collectible";
    el.id = "tl-item-" + id;
    el.style.cssText = `animation-duration:${dur}s; animation-name:slideLeft; bottom:${isObs ? "40px" : 55 + Math.random() * 60 + "px"}`;
    el.textContent = emoji;
    track.appendChild(el);

    // collision detection
    const checkInterval = setInterval(() => {
      if (!running) {
        clearInterval(checkInterval);
        return;
      }
      const rect1 = runner.getBoundingClientRect();
      const el2 = document.getElementById("tl-item-" + id);
      if (!el2) {
        clearInterval(checkInterval);
        return;
      }
      const rect2 = el2.getBoundingClientRect();
      const overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
      if (overlap) {
        clearInterval(checkInterval);
        if (!isObs) {
          collected++;
          colEl.textContent = collected;
        }
        el2.remove();
      }
    }, 80);

    setTimeout(
      () => {
        clearInterval(checkInterval);
        document.getElementById("tl-item-" + id)?.remove();
      },
      dur * 1000 + 200,
    );
  }

  runInterval = setInterval(() => {
    if (!running) return;
    dist++;
    distEl.textContent = dist;
    const msIdx = Math.floor((dist / TARGET_DIST) * (MILESTONES.length - 1));
    msEl.textContent = MILESTONES[Math.min(msIdx, MILESTONES.length - 1)];
    if (dist >= TARGET_DIST) endGame();
  }, 200);

  spawnInterval = setInterval(spawnItem, 1400);

  function endGame() {
    running = false;
    clearInterval(runInterval);
    clearInterval(spawnInterval);
    runner.textContent = "🎓";
    track
      .querySelectorAll(".timeline-obstacle,.timeline-collectible")
      .forEach((i) => i.remove());
    jumpBtn.disabled = true;
    msEl.textContent = "🎓 You made it to graduation day!";
    setTimeout(
      () => onComplete({ score: collected, maxScore: 20, passed: true }),
      1200,
    );
  }
}
