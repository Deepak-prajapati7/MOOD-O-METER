const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  }
});

const checkInGuidance = {
  talk: {
    title: "A conversation is a good next step.",
    message: "If there’s a campus counsellor or someone you trust, you could reach out and let them know you’d like to talk.",
    link: "Explore the human-led support path",
    href: "#journey",
  },
  calm: {
    title: "Let’s make a little room to breathe.",
    message: "You could try a gentle two-minute pause. You can stop at any point and do what feels comfortable.",
    link: "Try the Sukoon breathing pause",
    href: "#sukoon",
  },
  lonely: {
    title: "You deserve connection.",
    message: "A small message to a friend, trusted person or campus support team can be a start. You don’t have to find the perfect words.",
    link: "See how campus support could connect",
    href: "#journey",
  },
  study: {
    title: "One thing at a time is enough.",
    message: "If it helps, choose one small task, take a short pause, or ask a tutor, peer or counsellor for support.",
    link: "Take a moment to reset",
    href: "#sukoon",
  },
  personal: {
    title: "You don’t have to explain everything at once.",
    message: "You can start with someone you trust, or ask a campus counsellor about a private conversation and what support is available.",
    link: "Explore the human-led support path",
    href: "#journey",
  },
  tired: {
    title: "Rest is a real need, not a reward.",
    message: "If you can, take a break somewhere comfortable. If exhaustion keeps weighing on you, consider talking with someone you trust.",
    link: "Learn about the proposed quiet space",
    href: "#safe-space",
  },
  professional: {
    title: "It’s okay to ask for professional help.",
    message: "A qualified counsellor or psychologist can listen and help you consider next steps. This demo can’t connect you to a service.",
    link: "See how campus support could connect",
    href: "#journey",
  },
  motivation: {
    title: "You don’t have to do it all at once.",
    message: "One bad day doesn’t mean a bad life. Asking for help is a sign of strength, and you’re allowed to take your time.",
    link: "See the support journey",
    href: "#journey",
  },
};

const choiceButtons = document.querySelectorAll(".choice-button");
const resultPanel = document.querySelector("#checkin-result");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const resultLink = document.querySelector("#result-link");

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const guidance = checkInGuidance[button.dataset.choice];
    if (!guidance) return;

    choiceButtons.forEach((choice) => {
      const selected = choice === button;
      choice.classList.toggle("is-selected", selected);
      choice.setAttribute("aria-pressed", String(selected));
    });
    resultTitle.textContent = guidance.title;
    resultMessage.textContent = guidance.message;
    resultLink.textContent = guidance.link;
    resultLink.href = guidance.href;
    resultPanel.hidden = false;
  });
  button.setAttribute("aria-pressed", "false");
});

document.querySelector(".result-reset").addEventListener("click", () => {
  resultPanel.hidden = true;
  choiceButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
});

const breathStart = document.querySelector("#breath-start");
const breathReset = document.querySelector("#breath-reset");
const breathClock = document.querySelector("#breath-clock");
const breathPrompt = document.querySelector("#breath-prompt");
const breathInstruction = document.querySelector("#breath-instruction");
const breathOrbit = document.querySelector("#breath-orbit");

const breathPhases = [
  { label: "Breathe in", instruction: "Slowly breathe in, only as much as feels comfortable.", duration: 4 },
  { label: "Pause", instruction: "Pause gently. No need to hold your breath.", duration: 2 },
  { label: "Breathe out", instruction: "Slowly breathe out and let your shoulders soften.", duration: 6 },
];

let remainingSeconds = 120;
let breathTimer = null;
let phaseElapsed = 0;
let phaseIndex = 0;

function renderClock() {
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  breathClock.textContent = `${minutes}:${seconds}`;
}

function renderBreathPhase() {
  const phase = breathPhases[phaseIndex];
  breathPrompt.textContent = phase.label;
  breathInstruction.textContent = phase.instruction;
}

function finishBreathing() {
  window.clearInterval(breathTimer);
  breathTimer = null;
  breathPrompt.textContent = "Well done";
  breathInstruction.textContent = "Your two minutes are complete. Take a moment before moving on.";
  breathStart.hidden = true;
  breathReset.hidden = false;
  breathOrbit.classList.remove("is-breathing");
}

function tickBreathing() {
  remainingSeconds -= 1;
  phaseElapsed += 1;
  const currentPhase = breathPhases[phaseIndex];
  if (phaseElapsed >= currentPhase.duration) {
    phaseIndex = (phaseIndex + 1) % breathPhases.length;
    phaseElapsed = 0;
    renderBreathPhase();
  }
  renderClock();
  if (remainingSeconds <= 0) finishBreathing();
}

breathStart.addEventListener("click", () => {
  if (breathTimer) {
    window.clearInterval(breathTimer);
    breathTimer = null;
    breathStart.innerHTML = 'Continue gently <span aria-hidden="true">→</span>';
    breathInstruction.textContent = "Paused. Continue whenever you feel ready, or leave the exercise here.";
    breathOrbit.classList.remove("is-breathing");
    return;
  }

  if (remainingSeconds === 120) renderBreathPhase();
  breathStart.innerHTML = 'Pause <span aria-hidden="true">Ⅱ</span>';
  breathOrbit.classList.add("is-breathing");
  breathTimer = window.setInterval(tickBreathing, 1000);
});

breathReset.addEventListener("click", () => {
  window.clearInterval(breathTimer);
  breathTimer = null;
  remainingSeconds = 120;
  phaseElapsed = 0;
  phaseIndex = 0;
  renderClock();
  breathPrompt.textContent = "Ready?";
  breathInstruction.textContent = "Find a comfortable position. Press start when you’re ready.";
  breathStart.hidden = false;
  breathStart.innerHTML = 'Begin gently <span aria-hidden="true">→</span>';
  breathReset.hidden = true;
  breathOrbit.classList.remove("is-breathing");
});

renderClock();
