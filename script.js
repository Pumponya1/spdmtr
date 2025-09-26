const btn    = document.getElementById('measureBtn');
const needle = document.getElementById('needle');
const result = document.getElementById('result');
const music  = document.getElementById('bg-music');
const photo  = document.querySelector('.photo');
const labels = [...document.querySelectorAll('.label')];

const state = { angle: -90 };
const labelAngles = [-72, -36, 0, 36, 72];
let lastIdx = -1;

// подписи по дуге (перпендикулярно радиусу!)
const toRad = d => (d * Math.PI) / 180;
function placeLabels() {
  const cx = 100, cy = 110, r = 115;
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
  for (let i = 0; i < labelAngles.length; i++) {
    const d = Math.abs(a - labelAngles[i]);
    if (d < best) { best = d; idx = i; }
  }
  if (idx !== lastIdx) {
    labels.forEach((l,i)=>l.classList.toggle('active', i===idx));
    lastIdx = idx;
  }
}

// применить угол
function applyNeedle() {
  needle.setAttribute('transform', `rotate(${state.angle},100,110)`);
  highlightByAngle(state.angle);
}

// сердечки — меньше, но плавные
function spawnHearts(count = 25) {
  for (let i=0;i<count;i++) {
    const h=document.createElement('div');
    h.textContent='❤️'; h.className='flying-heart';
    const startX=Math.random()*window.innerWidth;
    h.style.left=`${startX}px`; h.style.top=`${window.innerHeight+30}px`;
    document.body.appendChild(h);
    anime({
      targets:h,
      translateY:-window.innerHeight-100,
      translateX:(Math.random()-0.5)*180,
      scale:Math.random()*1.2+0.6,
      duration:3500+Math.random()*1500,
      easing:'linear', // максимально плавно
      complete:()=>h.remove()
    });
  }
}

// анимация измерения
let clicks=0, resetTimer=null;
const phrases=[
  'Любовь зашкаливает ❤️',
  'Опасный уровень чувств 🔥',
  'Зона перегрева 💋',
  'Будьте осторожны: зависимость 😍',
  'Максимум! 🚀'
];

function measure() {
  clicks++;
  result.textContent='Измеряю…';
  music?.play().catch(()=>{});
  if(resetTimer){clearTimeout(resetTimer);resetTimer=null;}

  anime({
    targets:state,
    angle:[
      { value:-60,duration:800,easing:'easeInOutSine' },
      { value:40,duration:1000,easing:'easeInOutSine' },
      { value:-20,duration:1000,easing:'easeInOutSine' },
      { value:90,duration:1600,easing:'easeOutElastic(1,.6)' }
    ],
    update:applyNeedle,
    complete:()=>{
      result.textContent=(clicks>3)?'Эй, хватит, уже и так всё ясно 😏':phrases[Math.floor(Math.random()*phrases.length)];
      spawnHearts();
      resetTimer=setTimeout(()=>{
        anime({
          targets:state,
          angle:-90,
          duration:1000,
          easing:'easeInOutQuad',
          update:applyNeedle,
          complete:()=>{labels.forEach(l=>l.classList.remove('active'));result.textContent='';}
        });
      },15000);
    }
  });
}

// пасхалка
let secret=0,secretTO=null;
photo.addEventListener('click',()=>{
  secret++;clearTimeout(secretTO);
  secretTO=setTimeout(()=>secret=0,700);
  if(secret>=3){spawnHearts(40);secret=0;}
});

// старт
applyNeedle();
btn.addEventListener('click',measure);
