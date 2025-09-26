const btn = document.getElementById("measureBtn");
const needle = document.getElementById("needle");
const result = document.getElementById("result");

const messages = [
  "Приятное общение ✨",
  "Симпатия 😊",
  "Влюблённость 💕",
  "Любовь ❤️",
  "Ваня + Настя 💖 Судьба!"
];

btn.addEventListener("click", () => {
  // случайный сектор
  const index = Math.floor(Math.random() * messages.length);

  // углы (подписи совпадают со стрелкой)
  const angles = [-80, -40, 0, 40, 80];
  needle.style.transform = `rotate(${angles[index]}deg)`;

  // вывод текста
  result.textContent = messages[index];
});
