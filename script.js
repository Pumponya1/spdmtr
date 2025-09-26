// элементы
const btn    = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');
const music  = document.getElementById('bg-music');
const photo  = document.querySelector('.photo');
const labels = [...document.querySelectorAll('.label')];

// состояния
const state = { angleTop: -90 }; // угол в системе "верх = 0°, лево = -90°, право = 90°"
const labelAngles = [-72, -36, 0, 36, 72]; // целевые углы подписей

// фразы
const phrases = [
  'Любовь зашкаливает ❤️',
  'Опасный уровень чувств 🔥',
  'Вы находитесь в зоне перегрева 💋',
  'Будьте осторожны: зависимость 😍',
  'Максимум! Больше измерить нельзя 🚀',
  'Ваши сердца синхронизированы на 100% 💖',
  '🔥 Система перегружена вашей любовью',
];

// математика
const toRad = d => (d * Math.PI) / 180;
function placeLabels() {
  const cx = 100, cy = 110, r = 78; // центр и радиус для подписей
  labels.forEach((lbl, i) => {
    const aTop = labelAngles[i];                      // -90..90 (0 = верх)
    const theta = toRad(90 - aTop);                   // перевод в систему cos/sin (0 = вправо)
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);               // минус, потому что y в SVG вниз
    lbl.setAttribute('x', x.toFixed(2));
    lbl.setAttribute('y', y.toFixed(2));
    // поворот по касательной к дуге
    lbl.setAttribute('transform', `rotate(${aTop} ${x.toFixed(2)} ${y.toFixed(2)})`);
  });
}
placeLabels();

// поиск ближайшей подписи по текущему углу
let lastIdx = -1;
function highlightByAngle(aTop) {
  // ищем ближайший целевой угол
  let idx = 0, best = Infinity;
  for (let i = 0; i < labelAngles.length; i++) {
    const d = Math.abs(aTop - labelAngles[i]);
    if (d < best) { best = d; idx = i; }
  }
  if (idx !== lastIdx) {
    labels.forEach((l, i) => l.classList.toggle('active', i === idx));
    labels[idx].classList.add('flash');
    setTimeout(() => labels[idx].classList.remove('flash'), 450);
    lastIdx = idx;
  }
}

// применить угол к стрелке (реальный поворот вокруг 100,110)
function applyNeedle() {
  needle.setAttribute('transform', `rotate(${state.angleTop},100,110)`);
  highlightByAngle(state.angleTop);
}

// сердечки — плавно и много, без «дёрганий»
function spawnHearts(count = 80) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.textContent = '❤️';
    h.className = 'flying-heart';
    const startX = Math.random() * window.innerWidth;
    h.style.left = `${startX}px`;
    h.style.top  = `${window.innerHeight + 20}px`;
    document.body.appendChild(h);

    anime({
      targets: h,
      translateY: -window.innerHeight - 120,
      translateX: (Math.random() - 0.5) * 220,
      scale: Math.random() * 1.5 + 0.6,
      duration: 4200 + Math.random() * 2200,
      easing: 'linear', // максимально плавно
      complete: () => h.remove()
    });
  }
}

// анимация измерения (6–7 сек покачиваний → рывок)
let clicks = 0;
let resetTimer = null;
function measure() {
  clicks++;
  result.textContent = 'Измеряю…';
  music?.play().catch(()=>{});
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }

  anime({
    targets: state,
    angleTop: [
      { value: -65, duration: 900,  easing: 'easeInOutSine' },
      { value:  35, duration: 1100, easing: 'easeInOutSine' },
      { value: -25, duration: 1100, easing: 'easeInOutSine' },
      { value:  45, duration: 900,  easing: 'easeInOutSine' },
      { value: -10, duration: 800,  easing: 'easeInOutSine' },
      { value:  90, duration: 2200, easing: 'easeOutElastic(1,.6)' }
    ],
    update: applyNeedle,
    complete: () => {
      result.textContent = (clicks > 3)
        ? 'Эй, хватит, уже и так всё ясно 😏'
        : phrases[Math.floor(Math.random()*phrases.length)];
      spawnHearts(90);
      resetTimer = setTimeout(() => {
        anime({
          targets: state,
          angleTop: -90,
          duration: 1000,
          easing: 'easeInOutQuad',
          update: applyNeedle,
          complete: () => { labels.forEach(l => l.classList.remove('active')); result.textContent=''; }
        });
      }, 20000);
    }
  });
}

// пасхалка: 3 клика по фото
let secret = 0, secretTO = null;
photo.addEventListener('click', () => {
  secret++; clearTimeout(secretTO);
  secretTO = setTimeout(()=> secret = 0, 800);
  if (secret >= 3) { spawnHearts(120); secret = 0; }
});

// старт
applyNeedle();
btn.addEventListener('click', measure);
