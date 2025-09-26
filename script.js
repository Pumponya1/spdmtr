const btn    = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');
const music  = document.getElementById('bg-music');
const photo  = document.querySelector('.photo');
const labels = [...document.querySelectorAll('.label')];

const phrases = [
  'Любовь зашкаливает ❤️',
  'Опасный уровень чувств 🔥',
  'Вы находитесь в зоне перегрева 💋',
  'Будьте осторожны: зависимость 😍',
  'Максимум! Больше измерить нельзя 🚀',
  'Ваши сердца синхронизированы на 100% 💖',
  '🔥 Система перегружена вашей любовью',
];

let clicks = 0;
let resetTimer = null;
let animInstance = null;
let lastIdx = -1;

/* Утилиты */
const toRad = deg => (deg * Math.PI) / 180;

/* Расставляем подписи по дуге и поворачиваем по касательной */
function layoutLabels() {
  const cx = 100, cy = 110;   // центр дуги во viewBox
  const r  = 78;              // радиус подписи (чуть меньше самой дуги)
  labels.forEach(lbl => {
    const ang = parseFloat(lbl.getAttribute('data-angle')); // -90..90
    const x = cx + r * Math.cos(toRad(ang));
    const y = cy + r * Math.sin(toRad(ang));
    lbl.setAttribute('x', x.toFixed(2));
    lbl.setAttribute('y', y.toFixed(2));
    // касательная к дуге = угол + 90 (для читабельности)
    lbl.setAttribute('transform', `rotate(${ang}, ${x.toFixed(2)}, ${y.toFixed(2)})`);
  });
}

/* Подсветка подписи по текущему углу стрелки */
function highlightByAngle(a) {
  const idx =
    a < -54 ? 0 :
    a < -18 ? 1 :
    a <  18 ? 2 :
    a <  54 ? 3 : 4;

  if (idx !== lastIdx) {
    labels.forEach((l,i) => l.classList.toggle('active', i === idx));
    if (labels[idx]) {
      labels[idx].classList.add('flash');
      setTimeout(() => labels[idx] && labels[idx].classList.remove('flash'), 450);
    }
    lastIdx = idx;
  }
}

/* Возврат в исходное */
function resetGauge() {
  anime({
    targets: {angle: state.angle},
    angle: -90,
    duration: 1000,
    easing: 'easeInOutQuad',
    update: anim => {
      state.angle = anim.animations[0].currentValue;
      needle.style.transform = `rotate(${state.angle}deg)`;
      highlightByAngle(state.angle);
    },
    complete: () => {
      labels.forEach(l => l.classList.remove('active','flash'));
      result.textContent = '';
      btn.textContent = 'Измерить любовь 💘';
    }
  });
}

/* Сердечки */
function spawnHearts(count = 60) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.className = 'flying-heart';
    const startX = Math.random() * window.innerWidth;
    heart.style.left = `${startX}px`;
    heart.style.top  = `${window.innerHeight + 20}px`;
    document.body.appendChild(heart);

    anime({
      targets: heart,
      translateY: -window.innerHeight - 120,
      translateX: (Math.random() - 0.5) * 220,
      scale: Math.random() * 1.5 + 0.6,
      duration: 4200 + Math.random() * 2200,
      easing: 'easeOutCubic',
      complete: () => heart.remove()
    });
  }
}

/* Состояние угла стрелки (в градусах) */
const state = { angle: -90 };

/* Запуск измерения (длинный «разгон») */
function measure() {
  clicks++;
  btn.disabled = true;
  result.textContent = 'Измеряю…';
  music?.play().catch(()=>{});

  // останавливаем прошлую анимацию/таймер
  animInstance?.pause();
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
  lastIdx = -1;

  const keyframes = [
    { value: -65,  duration: 700,  easing: 'easeInOutSine' },
    { value:  35,  duration: 900,  easing: 'easeInOutSine' },
    { value: -30,  duration: 900,  easing: 'easeInOutSine' },
    { value:  45,  duration: 800,  easing: 'easeInOutSine' },
    { value: -10,  duration: 700,  easing: 'easeInOutSine' },
    { value:  90,  duration: 2200, easing: 'easeOutElastic(1,.6)' },
  ];

  // анимируем собственное число и сами применяем поворот
  animInstance = anime({
    targets: state,
    angle: keyframes,
    update: () => {
      needle.style.transform = `rotate(${state.angle}deg)`;
      highlightByAngle(state.angle);
    },
    complete: () => {
      if (clicks > 3) result.textContent = 'Эй, хватит, уже и так всё ясно 😏';
      else result.textContent = phrases[Math.floor(Math.random()*phrases.length)];

      spawnHearts(60);
      btn.disabled = false;
      btn.textContent = 'Ещё раз 💞';

      resetTimer = setTimeout(resetGauge, 20000);
    }
  });
}

/* Пасхалка: 3 клика по фото */
let secretClicks = 0, secretTO = null;
photo.addEventListener('click', () => {
  secretClicks++;
  clearTimeout(secretTO);
  secretTO = setTimeout(() => secretClicks = 0, 800);
  if (secretClicks >= 3) {
    spawnHearts(90);
    secretClicks = 0;
  }
});

/* Инициализация */
layoutLabels();
btn.addEventListener('click', measure);
