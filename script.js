const btn = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');

const phrases = [
  'Любовь зашкаливает ❤️',
  'Опасный уровень чувств 🔥',
  'Вы находитесь в зоне перегрева 💋',
  'Будьте осторожны: зависимость 😍',
  'Максимум! Больше измерить нельзя 🚀',
  'Ваши сердца синхронизированы на 100% 💖',
  '🔥 Система перегружена вашей любовью'
];

btn.addEventListener('click', () => {
  // Сбрасываем текст
  result.textContent = 'Измеряю...';

  // Анимация стрелки
  anime({
    targets: needle,
    rotate: [
      { value: -90, duration: 0 },
      { value: 90, duration: 1500, easing: 'easeOutElastic(1, .6)' }
    ]
  });

  // Выводим случайную фразу
  setTimeout(() => {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    result.textContent = randomPhrase;
  }, 1600);
});
