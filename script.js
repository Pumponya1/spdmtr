const btn = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');
const music = document.getElementById('bg-music');
const photo = document.querySelector('.photo');

const segs = [
  document.querySelector('.s1'),
  document.querySelector('.s2'),
  document.querySelector('.s3'),
  document.querySelector('.s4'),
  document.querySelector('.s5'),
];

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

/** Подсветка сегмента по текущему углу */
function highlightByAngle(angleDeg) {
  // -90..-54..-18..18..54..90 (5 сегментов)
  const idx =
    angleDeg < -54 ? 0 :
    angleDeg < -18 ? 1 :
    angleDeg <  18 ? 2 :
    angleDeg <  54 ? 3 : 4;

  segs.forEach((s, i) => s.classList.toggle('active', i === idx));
}

/** Короткая вспышка при пересечении границы сегмента */
let lastIdx = -1;
function flashOnChange(angleDeg) {
  const idx =
    angleDeg < -54 ? 0 :
    angleDeg < -18 ? 1 :
    angleDeg <  18 ? 2 :
    angleDeg <  54 ? 3 : 4;

  if (idx !== lastIdx) {
    segs[idx].classList.add('flash');
    setTimeout(() => segs[idx].classList.remove('flash'), 450);
    lastIdx = idx;
  }
}

/** Запуск анимации измерения */
function measure() {
  clicks += 1;
  btn.disabled = true;
  result.textContent = 'Измеряю…';

  // стартуем музыку после первого взаимодействия
  music?.play().catch(() => {});

  // убить предыдущую анимацию/таймер, если были
  animInstance?.pause();
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }

  // Сброс визуалов
  segs.forEach(s => s.classList.remove('active', 'flash'));
  lastIdx = -1;

  // Композитная анимация «разгон + рывок»
  animInstance = anime({
    targets: needle,
    rotate: [
      { value: -60, duration: 260, easing: 'easeOutQuad' },
      { value: 50,  duration: 360, easing: 'easeInOutQuad' },
      { value: -20, duration: 360, easing: 'easeInOutQuad' },
      { value: 90,  duration: 1400, easing: 'easeOutElastic(1, .6)' }
    ],
    update: () => {
      const t = needle.style.transform; // "rotate(XXdeg)"
      const m = /rotate\(([-\d.]+)deg\)/.exec(t);
      if (!m) return;
      const angle = parseFloat(m[1]);
      highlightByAngle(angle);
      flashOnChange(angle);
    },
    complete: () => {
      // Сообщение
      if (clicks >= 4) {
        result.textContent = 'Эй, хватит, уже и так всё ясно 😏';
      } else {
        const p = phrases[Math.floor(Math.random() * phrases.length)];
        result.textContent = p;
      }
      btn.disabled = false;
      btn.textContent = 'Ещё раз 💞';

      // Немного сердечек по клику «Измерить»
      spawnHearts(10);

      // Возврат через 20 сек
      resetTimer = setTimeout(resetGauge, 20000);
    }
  });
}

/** Возврат стрелки и очистка подсветок */
function resetGauge() {
  anime({
    targets: needle,
    rotate: -90,
    duration: 900,
    easing: 'easeInOutQuad',
    update: () => highlightByAngle(-90),
    complete: () => {
      segs.forEach(s => s.classList.remove('active', 'flash'));
      result.textContent = '';
      btn.textContent = 'Измерить любовь 💘';
    }
  });
}

/** Сердечки (для кнопки и для пасхалки) */
function spawnHearts(count = 18) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.className = 'flying-heart';
    const startX = Math.random() * window.innerWidth;
    heart.style.left = `${startX}px`;
    heart.style.top = `${window.innerHeight + 20}px`;
    document.body.appendChild(heart);

    anime({
      targets: heart,
      translateY: -window.innerHeight - 120,
      translateX: (Math.random() - 0.5) * 160,
      opacity: [{ value: 1, duration: 100 }, { value: 0, duration: 600, delay: 2600 }],
      duration: 3200 + Math.random() * 1200,
      easing: 'easeOutCubic',
      complete: () => heart.remove()
    });
  }
}

/** Пасхалка: 3 клика по фото */
let secretClicks = 0;
let secretTimer = null;
photo.addEventListener('click', () => {
  secretClicks++;
  clearTimeout(secretTimer);
  secretTimer = setTimeout(() => secretClicks = 0, 800);
  if (secretClicks >= 3) {
    spawnHearts(30);
    secretClicks = 0;
  }
});

/** Кнопка */
btn.addEventListener('click', measure);
