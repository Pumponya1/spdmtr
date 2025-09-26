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
let state = { angle: -90 };

function highlight(angle) {
  labels.forEach(l => l.classList.remove('active'));
  if (angle < -54) labels[0].classList.add('active');
  else if (angle < -18) labels[1].classList.add('active');
  else if (angle < 18) labels[2].classList.add('active');
  else if (angle < 54) labels[3].classList.add('active');
  else labels[4].classList.add('active');
}

function measure() {
  clickCount++;
  result.textContent = 'Измеряю…';
  music.play().catch(()=>{});

  anime({
    targets: state,
    angle: [
      { value: -60, duration: 1000, easing: 'easeInOutSine' },
      { value: 40, duration: 1200, easing: 'easeInOutSine' },
      { value: -20, duration: 1200, easing: 'easeInOutSine' },
      { value: 90, duration: 3000, easing: 'easeOutElastic(1,.6)' }
    ],
    duration: 7000,
    update: () => {
      needle.setAttribute('transform', `rotate(${state.angle},100,110)`);
      highlight(state.angle);
    },
    complete: () => {
      if (clickCount > 3) {
        result.textContent = 'Эй, хватит, уже и так всё ясно 😏';
      } else {
        result.textContent = phrases[Math.floor(Math.random()*phrases.length)];
      }
      spawnHearts(80);
      setTimeout(resetGauge, 20000);
    }
  });
}

function resetGauge() {
  anime({
    targets: state,
    angle: -90,
    duration: 1000,
    easing: 'easeInOutQuad',
    update: () => {
      needle.setAttribute('transform', `rotate(${state.angle},100,110)`);
      highlight(state.angle);
    },
    complete: () => {
      labels.forEach(l => l.classList.remove('active'));
      result.textContent = '';
    }
  });
}

function spawnHearts(count = 80) {
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
      easing: 'linear',
      complete: () => heart.remove()
    });
  }
}

// Пасхалка — 3 клика по фото
let secret = 0;
photo.addEventListener('click', () => {
  secret++;
  if (secret >= 3) {
    spawnHearts(100);
    secret = 0;
  }
});

btn.addEventListener('click', measure);
