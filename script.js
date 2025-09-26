const btn    = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');
const music  = document.getElementById('bg-music');
const photo  = document.querySelector('.photo');
const labels = [...document.querySelectorAll('.label')];

const state = { angle: -90 };
const labelAngles = [-72, -36, 0, 36, 72];
let lastIdx = -1;

// математика для текста (перпендикулярно дуге)
const toRad = d => (d * Math.PI) / 180;
function placeLabels() {
  const cx = 100, cy = 110, r = 105;
  labels.forEach((lbl, i) => {
    const a = labelAngles[i];
    const theta = toRad(90 - a);
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);
    lbl.setAttribute('x', x.toFixed(2));
    lbl.setAttribute('y', y.toFixed(2));
    lbl.setAttribute('transform', `rotate(${a} ${x.toFixed(2)} ${y.toFixed(2)})`);
  });
}
placeLabels();

// подсветка
function highlightByAngle(a) {
  let idx = 0, best = Infinity;
  for (let
