// gameRegistry.js — defines available games

const GAME_REGISTRY = {
  balloons: {
    id: "balloons",
    title: "Balloon Pop",
    emoji: "🎈",
    description: "Pop floating balloons before they escape.",
    actionLabel: "Tap to pop",
    themeClass: "theme-balloons",
    previewType: "balloons",
    defaultSelected: true,
    start: startBalloonsGame,
  },
  futureBag: {
    id: "futureBag",
    title: "Future Bag",
    emoji: "🎒",
    description: "Pack the best things for their next chapter.",
    actionLabel: "Pick what to pack",
    themeClass: "theme-future-bag",
    previewType: "futureBag",
    defaultSelected: false,
    start: startFutureBagGame,
  },
  quiz: {
    id: "quiz",
    title: "Quiz Quest",
    emoji: "🎓",
    description: "Answer a playful question before opening the card.",
    actionLabel: "Choose an answer",
    themeClass: "theme-quiz",
    previewType: "quiz",
    defaultSelected: false,
    start: startQuizGame,
  },
  memories: {
    id: "memories",
    title: "Memory Lane",
    emoji: "💌",
    description: "Catch sweet memories from the journey.",
    actionLabel: "Catch the good stuff",
    themeClass: "theme-memories",
    previewType: "memories",
    defaultSelected: false,
    start: startMemoriesGame,
  },
  timelineDash: {
    id: "timelineDash",
    title: "Timeline Dash",
    emoji: "🏃‍♀️‍➡️",
    description: "Race through milestones and reach the finish.",
    actionLabel: "Jump and collect",
    themeClass: "theme-timeline",
    previewType: "timeline",
    defaultSelected: false,
    start: startTimelineDashGame,
  },
  complimentCollector: {
    id: "complimentCollector",
    title: "Compliment Collector",
    emoji: "💖",
    description: "Collect kind words to build a final cheer.",
    actionLabel: "Collect kind words",
    themeClass: "theme-compliments",
    previewType: "compliments",
    defaultSelected: false,
    start: startComplimentCollectorGame,
  },
};

function renderGamePreview(previewType) {
  const previews = {
    balloons: `<span style="font-size:18px">🎈</span><span style="font-size:16px">🎈</span><span style="font-size:20px">🎈</span>`,
    futureBag: `<span style="font-size:24px">🎒</span><span style="font-size:14px;margin-left:4px">✨</span>`,
    quiz: `<span style="font-size:22px">❓</span><span style="font-size:12px;margin-left:4px">A B C D</span>`,
    memories: `<span style="font-size:16px">🌟💌🎉✨</span>`,
    timeline: `<span style="font-size:16px">🏃‍♀️‍➡️ → 🎓</span>`,
    compliments: `<span style="font-size:13px;font-style:italic">kind words…</span>`,
  };
  return previews[previewType] || "🎮";
}
