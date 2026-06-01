// messageHelper.js — local message draft generation

const MESSAGE_TEMPLATES = {
  sweet: [
    (r, s, d) =>
      `You have such a gift for making ordinary moments feel special. ${d ? "Especially when " + d + "." : ""} I am so lucky to have you in my life, and I cannot wait to see everything you do next. Here's to you, ${r} — you deserve every good thing coming your way.`,
    (r, s, d) =>
      `Some people just make the world brighter. You are one of them. ${d ? "I will always remember " + d + "." : ""} Thank you for being exactly who you are. Wishing you all the joy and warmth you bring to everyone around you.`,
  ],
  funny: [
    (r, s, d) =>
      `They said it could not be done. They were wrong. You proved them wrong! ${d ? "(Especially that moment with " + d + " — that is going in the hall of fame.)" : ""} Congratulations on being objectively spectacular. I am only slightly jealous.`,
    (r, s, d) =>
      `I was going to write something profound, but honestly? You are already living it. ${d ? "Like that time with " + d + "." : ""} So here I am, your biggest fan, raising an imaginary glass to the most ridiculously great person I know.`,
  ],
  emotional: [
    (r, s, d) =>
      `There are moments that stay with you — moments where you realize how truly extraordinary someone is. ${d ? "Like when " + d + "." : ""} You have been one of those moments for me. Thank you for everything, ${r}. Truly.`,
    (r, s, d) =>
      `Watching you get here has been one of the greatest privileges of my life. Every step, every challenge, every little victory. ${d ? "And " + d + " — I will never forget it." : ""} I am so incredibly proud of you, and I hope you feel that today.`,
  ],
  proud: [
    (r, s, d) =>
      `You worked hard for this. You showed up, again and again, when it was not easy. ${d ? "I saw it — especially with " + d + "." : ""} This moment is completely yours, and you earned every bit of it. I could not be more proud of you.`,
    (r, s, d) =>
      `This is YOUR moment, ${r}. No one handed you anything — you built this. ${d ? "(Yes, including " + d + ".)" : ""} The road ahead is going to be even better because of who you have become along the way. Go get it.`,
  ],
  chaotic: [
    (r, s, d) =>
      `Okay so I was going to write something really beautiful and heartfelt but then I spilled my coffee and now I am writing this and honestly? ${d ? d + " is coming to mind and I cannot stop laughing." : "Here we are."} ANYWAY. You are incredible. This is your moment. I love you. Do not forget me when you are famous.`,
    (r, s, d) =>
      `Where do I even BEGIN. ${d ? d + "???" : "There are too many things."} The chaos, the laughs, the whole unhinged journey — and look at you now! Absolutely unhinged in the best way. I am so proud. Also slightly in awe. Also maybe I owe you an apology for like three things but this is not the time.`,
  ],
};

function generateMessageDraft({ recipientName, senderName, tone, details }) {
  const templates = MESSAGE_TEMPLATES[tone] || MESSAGE_TEMPLATES.sweet;
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(
    recipientName || "you",
    senderName || "someone who cares",
    details || "",
  );
}
