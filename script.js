const needle = document.getElementById('needle');
const button = document.getElementById('measureBtn');
const heartsContainer = document.getElementById('hearts');

// Углы для каждой метки
const angles = [-110, -70, -30, 10, 50]; 

button.addEventListener('click', () => {
  // случайный индекс
  const idx = Math.floor(Math.random() * angles.length);
  const angle = angles[idx];

  // анимация стрелки
  let current = -110;
  const interval = setInterval(() => {
    current += (angle - current) / 10;
    needle.style.transform = `rotate(${current}deg)`;
    if (Math.abs(current - angle) < 0.5) {
      clearInterval(interval);
    }
  }, 30);

  // сердечки
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (2 + Math.random() * 2) + 's';
    heart.innerHTML = '❤️';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
});
