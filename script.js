const canvas = document.getElementById("loveMeter");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const cx = W / 2;
const cy = H / 2 + 30;
const radius = Math.min(W, H) * 0.42;
const arcWidth = 36;

const startAngle = Math.PI;
const endAngle = Math.PI * 2.0;

let angleDeg = 180;
let animRAF;
let isAnimating = false;

// массив для сердечек
let particles = [];

// эффект "хлопка"
let popScale = 1;
let popAnimating = false;
let popStart = 0;

// 🔧 Настройки текста
const labelSettings = {
  first:  { size: 17, offsetX: 0, offsetY: -2, offsetR: 10, angle: 180, text: ["Приятное", "общение"], align: "right",  rangeStart: 185, rangeEnd: 200 },
  second: { size: 17, offsetX: -20, offsetY: -5, offsetR: 26, angle: 225, text: ["Симпатия"], align: "center", rangeStart: 210, rangeEnd: 240 },
  third:  { size: 17, offsetX: 0, offsetY: 0, offsetR: 16, angle: 270, text: ["Влюбленность"], align: "center", rangeStart: 250, rangeEnd: 280 },
  fourth: { size: 17, offsetX: -13, offsetY: -2, offsetR: 22, angle: 315, text: ["Любовь"], align: "left", rangeStart: 300, rangeEnd: 330 },
  fifth:  { size: 20, offsetX: 50, offsetY: -1, offsetR: 38, angle: 360, text: ["Ваня + Настя ❤️"], align: "center", rangeStart: 358, rangeEnd: 362, special: true }
};

// 🔧 Настройки кнопки (только тут двигай!)
const buttonSettings = {
  offsetX: -210,     // ← сдвиг по горизонтали (минус — левее, плюс — правее)
  offsetY: 550,   // ← сдвиг по вертикали (чем больше, тем ниже)
  paddingX: 70,   // ← ширина кнопки
  paddingY: 26,   // ← высота кнопки
  fontSize: 28    // ← размер текста и ❤️
};

const button = document.getElementById("loveButton");
function applyButtonSettings() {
  button.style.left = `calc(50% + ${buttonSettings.offsetX}px)`;
  button.style.top = `${buttonSettings.offsetY}px`;
  button.style.transform = "translateX(-50%)";
  button.style.padding = `${buttonSettings.paddingY}px ${buttonSettings.paddingX}px`;
  button.style.fontSize = `${buttonSettings.fontSize}px`;
}
applyButtonSettings();

// пресет «хаос»
const animationSettings = {
  chaosCount: 20,
  chaosAmplitude: 60,
  totalTime: 6000,
  chaosMin: 200,
  chaosMax: 340
};

// easing
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeOutQuad(t) {
  return t * (2 - t);
}

// сценарий
function buildScenario() {
  const steps = [];
  steps.push({ from: 180, to: 260, duration: 400, easing: easeInOut });

  let last = 260;
  for (let i = 0; i < animationSettings.chaosCount; i++) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    let delta = Math.random() * animationSettings.chaosAmplitude + 20;
    let next = last + dir * delta;
    if (next < animationSettings.chaosMin) next = animationSettings.chaosMin;
    if (next > animationSettings.chaosMax) next = animationSettings.chaosMax;
    steps.push({ from: last, to: next, duration: 200 + Math.random() * 200, easing: easeInOut });
    last = next;
  }

  steps.push({ from: last, to: 360, duration: 500, easing: easeOutQuad });
  return steps;
}

// анимация стрелки
function animateNeedle() {
  const scenario = buildScenario();
  let stepIndex = 0;
  let stepStart = performance.now();
  isAnimating = true;

  function step(now) {
    if (stepIndex >= scenario.length) {
      angleDeg = 360;
      triggerPopEffect();
      showRandomPhrase();
      isAnimating = false;
      return;
    }

    const current = scenario[stepIndex];
    const elapsed = now - stepStart;
    const t = Math.min(1, elapsed / current.duration);
    const eased = current.easing ? current.easing(t) : easeInOut(t);

    // + шум
    const jitter = (Math.random() - 0.5) * 2; 
    angleDeg = current.from + (current.to - current.from) * eased + jitter;

    if (t >= 1) {
      stepIndex++;
      stepStart = now;
    }

    if (isAnimating) animRAF = requestAnimationFrame(step);
  }

  animRAF = requestAnimationFrame(step);
}

// эффект хлопка и сердечек
function triggerPopEffect() {
  popAnimating = true;
  popStart = performance.now();
  spawnHearts(W/2, H/2); 
}

function updatePopEffect() {
  if (!popAnimating) return;
  const elapsed = performance.now() - popStart;

  if (elapsed < 150) {
    popScale = 1 + (elapsed / 150) * 0.5;
  } else if (elapsed < 300) {
    popScale = 1.5 - ((elapsed - 150) / 150) * 0.5;
  } else {
    popScale = 1;
    popAnimating = false;
  }
}

// сердечки
function spawnHearts(x, y) {
  for (let i = 0; i < 30; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.0;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 100 + Math.random() * 60,
      size: 18 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.1
    });
  }
}

function updateParticles() {
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.02;
    p.rotation += p.vr;
    p.life--;
  });
  particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 120);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.font = `${p.size}px Arial`;
    ctx.fillText("❤️", 0, 0);
    ctx.restore();
  });
}

// рисование
function drawArc() {
  const g = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  g.addColorStop(0.00, "#3EFcff");
  g.addColorStop(0.15, "#0690FF");
  g.addColorStop(0.32, "#6A23FF");
  g.addColorStop(0.50, "#FFB0E6");
  g.addColorStop(0.65, "#FFD891");
  g.addColorStop(0.80, "#FF7B2F");
  g.addColorStop(0.92, "#FF3A1E");
  g.addColorStop(1.00, "#FF0000");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle, false);
  ctx.lineWidth = arcWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = g;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, startAngle, endAngle, false);
  ctx.lineWidth = arcWidth + 6;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.stroke();
}

function drawNeedle() {
  const angleRad = angleDeg * Math.PI / 180;
  const tipLen = 22;
  const tipHalf = 10;
  const shaftWidth = 8;
  const margin = 6;

  const maxLen = radius - arcWidth/2 - margin;
  const endX = cx + Math.cos(angleRad) * maxLen;
  const endY = cy + Math.sin(angleRad) * maxLen;
  const baseX = endX - Math.cos(angleRad) * tipLen;
  const baseY = endY - Math.sin(angleRad) * tipLen;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(baseX, baseY);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = shaftWidth;
  ctx.lineCap = "round";
  ctx.stroke();

  const perpX = -Math.sin(angleRad);
  const perpY =  Math.cos(angleRad);
  const p1x = baseX + perpX * tipHalf;
  const p1y = baseY + perpY * tipHalf;
  const p2x = baseX - perpX * tipHalf;
  const p2y = baseY - perpY * tipHalf;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(p1x, p1y);
  ctx.lineTo(p2x, p2y);
  ctx.closePath();
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
}

function drawTicks() {
  const degrees = [180, 225, 270, 315, 360];
  const rOuter = radius + arcWidth/2 - 4;
  const rInner = radius - arcWidth/2 + 6;

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  degrees.forEach(d => {
    const a = (d * Math.PI) / 180;
    const xO = cx + Math.cos(a) * rOuter;
    const yO = cy + Math.sin(a) * rOuter;
    const xI = cx + Math.cos(a) * rInner;
    const yI = cy + Math.sin(a) * rInner;

    ctx.beginPath();
    ctx.moveTo(xI, yI);
    ctx.lineTo(xO, yO);
    ctx.stroke();
  });
}

function drawLabel(settings) {
  const active = angleDeg >= settings.rangeStart && angleDeg <= settings.rangeEnd;
  let scale = settings.special && popAnimating ? popScale : 1;

  ctx.save();
  ctx.font = `700 ${settings.size * scale}px -apple-system, Segoe UI, Roboto, Inter, Arial`;
  ctx.fillStyle = active ? "#FFD700" : "#FFFFFF";
  ctx.textAlign = settings.align;
  ctx.textBaseline = "middle";

  ctx.shadowColor = active ? "rgba(255,215,0,0.9)" : "rgba(255,255,255,0.5)";
  ctx.shadowBlur = active ? 25 : 8;

  const a = settings.angle * Math.PI / 180;
  const rText = radius + arcWidth/2 + settings.offsetR;
  const x = cx + Math.cos(a) * rText + settings.offsetX;
  const y = cy + Math.sin(a) * rText + settings.offsetY;

  if (settings.text.length > 1) {
    ctx.fillText(settings.text[0], x, y - settings.size/2);
    ctx.fillText(settings.text[1], x, y + settings.size/2);
  } else {
    ctx.fillText(settings.text[0], x, y);
  }

  ctx.restore();
}

// 🎉 Фразы
const phrases = [
  "Любовь зашкаливает ❤️",
  "Опасный уровень чувств 🔥",
  "Вы находитесь в зоне перегрева 💋",
  "Будьте осторожны: зависимость друг от друга 😍",
  "Максимум! Больше измерить нельзя 🚀",
  "💖 Ваши сердца синхронизированы на 100%",
  "🔥 Система перегружена вашей любовью"
];
const easterEggs = [
  "Эй, хватит уже, и так всё ясно 😏",
  "Дальше нет! Это уже за гранью любви 💜"
];
let clickCount = 0;
const resultText = document.getElementById("resultText");

function showRandomPhrase() {
  clickCount++;
  if (clickCount >= 3 && clickCount <= 4) {
    resultText.textContent = easterEggs[Math.floor(Math.random() * easterEggs.length)];
  } else {
    resultText.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  }
}

// 🔄 постоянный цикл рендера
function renderLoop() {
  ctx.clearRect(0, 0, W, H);
  updatePopEffect();
  drawArc();
  drawTicks();
  drawLabel(labelSettings.first);
  drawLabel(labelSettings.second);
  drawLabel(labelSettings.third);
  drawLabel(labelSettings.fourth);
  drawLabel(labelSettings.fifth);
  drawNeedle();
  updateParticles();
  drawParticles();

  requestAnimationFrame(renderLoop);
}
renderLoop();

// 🎵 Музыка (играет только при первом клике)
const song = document.getElementById("loveSong");
let songPlayed = false;

document.getElementById("loveButton").addEventListener("click", () => {
  animateNeedle();
  if (!songPlayed) {
    song.play();
    songPlayed = true;
  }
});
