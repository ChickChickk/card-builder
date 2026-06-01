// quizGame.js — Quiz Quest mini game

function startQuizGame(container, onComplete) {
  const QUESTIONS = [
    {
      q: "What does every great journey start with?",
      options: [
        "A single step",
        "A perfect plan",
        "A lucky break",
        "An alarm clock",
      ],
      correct: 0,
      feedback: "One step at a time — that's how mountains are climbed.",
    },
    {
      q: "What's the best thing about starting something new?",
      options: [
        "The uncertainty",
        "The possibilities",
        "The paperwork",
        "Nothing — change is scary",
      ],
      correct: 1,
      feedback: "Exactly! The possibilities are endless from here.",
    },
    {
      q: "What's the real reward for hard work?",
      options: ["The trophy", "Who you become", "Free snacks", "A certificate"],
      correct: 1,
      feedback: "The real prize is always who you become along the way.",
    },
    {
      q: "The secret ingredient to any success story?",
      options: ["Talent", "Luck", "Showing up", "WiFi"],
      correct: 2,
      feedback: "Showing up, again and again — that's the whole secret.",
    },
    {
      q: "What should you always pack for the next chapter?",
      options: ["Courage", "Snacks", "Both", "A map"],
      correct: 2,
      feedback: "Courage AND snacks. Always both.",
    },
  ];

  const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  let answered = false;

  container.innerHTML = `
    <div class="quiz-area">
      <p class="game-instruction">Answer the question to unlock your card</p>
      <h3 class="quiz-question">${question.q}</h3>
      <div class="quiz-options" id="quiz-options"></div>
      <div class="quiz-result" id="quiz-result"></div>
    </div>
  `;

  const optionsEl = container.querySelector("#quiz-options");
  const resultEl = container.querySelector("#quiz-result");
  const letters = ["A", "B", "C", "D"];

  question.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${opt}`;
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      const isCorrect = i === question.correct;
      optionsEl.querySelectorAll(".quiz-option").forEach((b, idx) => {
        if (idx === question.correct) b.classList.add("is-correct");
        else if (idx === i && !isCorrect) b.classList.add("is-wrong");
      });

      resultEl.innerHTML = `
        <p>${isCorrect ? "✨ That's the one!" : "💛 Almost — but the card is still yours."}</p>
        <p style="margin-top:8px;font-style:italic;color:var(--text-mid);font-size:14px">${question.feedback}</p>
        <button class="quiz-continue show" id="quiz-next">Open your message →</button>
      `;

      container.querySelector("#quiz-next").addEventListener("click", () => {
        onComplete({ score: isCorrect ? 1 : 0, maxScore: 1, passed: true });
      });
    });
    optionsEl.appendChild(btn);
  });
}
