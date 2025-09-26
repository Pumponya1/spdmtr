const btn = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');
const music = document.getElementById('bg-music');
const labels = document.querySelectorAll('.label');
const photo = document.querySelector('.photo');

const phrases = [
  'Любовь зашкаливает ❤️',
  'Опасный уровень чувств 🔥',
  'Вы находитесь в зоне перегрева 💋',
  'Будьте осторожны: зависимость 😍',
  'Максимум! Больше измерить нельзя 🚀',
  'Ваши сердца синхронизированы на 100% 💖',
  '🔥 Система перегружена вашей любовью',
];

let clickCount = 0;

// Определяем активный сегмент по углу
function highlightLabel(angle) {
  labels.forEach(l => l.classList.remove('active'));
  if (angle < -50) labels[0].classList.add('active');
  else if (angle < -20) labels[1].classList.add('active');
  else if (angle < 20) labels[2].classList.add('active');
  else if (angle < 50) labels[3].classList.add('active');
  else labels[4].classList.add('active');
}

// Анимация стрелки
btn.addEventListener('click', () => {
  music.play().catch(() => {}); // музыка только после клика
  clickCount++;
  result.textContent = 'Измеряю…';

  anime({
    targets: needle,
    rotate: [
      { value: -70, duration: 600, easing: 'easeInOutSine' },
      { value: 40, duration: 800, easing: 'easeInOutSine' },
      { value: -30, duration: 800, easing: 'easeInOutSine' },
      { value: 90, duration: 3000, easing: 'easeOutElastic(1, .6)' }
    ],
    duration: 6000,
    update: anim => {
      const m = /rotate\\(([-\\d.]+),100,110\\)/.exec(needle.getAttribute('transform'));
      if (m) {
        const angle = parseFloat(m[1]);
        highlightLabel(angle);
      }
    },
    complete: () => {
      if (clickCount > 3) {
        result.textContent = 'Эй, хватит, уже и так всё ясно 😏';
      } else {
        result.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      }
      spawnHearts(60);
      // Возврат через 20 сек
      setTimeout(() => {
        anime({
          targets: needle,
          rotate: -90,
          duration: 1000,
          easing: 'easeInOutQuad',
          complete: () => labels.forEach(l => l.classList.remove('active'))
        });
        result.textContent = '';
      }, 20000);
    }
  });
});

// Сердечки
function spawnHearts(count = 50) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.classList.add('flying-heart');
    document.body.appendChild(heart);

    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 'px';

    anime({
      targets: heart,
      translateY: -window.innerHeight - 100,
      translateX: (Math.random() - 0.5) * 200,
      scale: Math.random() * 1.5 + 0.5,
      duration: 4000 + Math.random() * 2000,
      easing: 'easeOutCubic',
      complete: () => heart.remove()
    });
  }
}

// Пасхалка: 3 клика по фото = сердечки
let secretClicks = 0;
photo.addEventListener('click', () => {
  secretClicks++;
  if (secretClicks >= 3) {
    spawnHearts(80);
    secretClicks = 0;
  }
});
