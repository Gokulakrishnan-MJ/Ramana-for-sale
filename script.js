// ====================================================================
//  RAMANA™ — prank engine
// ====================================================================

// ----- Personalization: ?victim=Name swaps "Ramana" everywhere -----
const params = new URLSearchParams(location.search);
let VICTIM = (params.get('victim') || 'Ramana').trim().slice(0, 20) || 'Ramana';
// basic sanitize (textContent is used, so this is just tidy-up)
VICTIM = VICTIM.replace(/[<>]/g, '');
const VUP = VICTIM.toUpperCase();
function applyVictim() {
  document.querySelectorAll('.vname').forEach((el) => {
    el.textContent = el.textContent === el.textContent.toUpperCase() && el.textContent.length > 2
      ? VUP : VICTIM;
  });
  // brand + ticker are uppercase
  document.querySelectorAll('.nav__brand .vname, .ticker .vname').forEach((el) => { el.textContent = VUP; });
  document.title = `${VICTIM}™ — Rent a Living Cash Machine`;
}
applyVictim();

// ----- Year -----
document.getElementById('year').textContent = new Date().getFullYear();

// ----- Money rain -----
const rain = document.getElementById('moneyRain');
const bills = ['🐰', '🥕', '✨', '💛', '🌟', '💸'];
const moneyBills = ['💸', '💵', '💰', '🤑', '🪙'];
let flow = 1; // rain intensity multiplier — boosted by the "make it rain" button
function spawnBill(money) {
  const b = document.createElement('div');
  b.className = 'bill';
  const set = money ? moneyBills : bills;
  b.textContent = set[Math.floor(Math.random() * set.length)];
  b.style.left = Math.random() * 100 + 'vw';
  const dur = 4 + Math.random() * 6;
  b.style.animationDuration = dur + 's';
  b.style.fontSize = 18 + Math.random() * 22 + 'px';
  rain.appendChild(b);
  setTimeout(() => b.remove(), dur * 1000);
}
// continuous rain — number of bills per tick scales with the current flow
setInterval(() => {
  const count = Math.max(1, Math.round(flow * 0.8));
  for (let i = 0; i < count; i++) spawnBill();
}, 350);

// ----- "Make it Rain" button: click frequency boosts the flow -----
let clickStamps = [];
const makeRainBtn = document.getElementById('makeRain');
const rainCombo = document.getElementById('rainCombo');

function clicksPerSec() {
  const now = Date.now();
  clickStamps = clickStamps.filter((t) => now - t < 1500);
  return clickStamps.length / 1.5;
}

function makeItRain() {
  clickStamps.push(Date.now());
  const cps = clicksPerSec();
  // intensity grows the faster you click (capped so it never lags)
  flow = Math.min(45, flow + 1 + cps);
  // immediate burst of money, sized by click frequency
  const burst = Math.min(34, 5 + Math.round(cps * 5));
  for (let i = 0; i < burst; i++) spawnBill(true);
  // each click also pumps the live counter, scaled by the combo
  cash += Math.floor(750 * flow);
  if (liveCash) liveCash.textContent = '$' + cash.toLocaleString();
  // combo badge
  rainCombo.textContent = '×' + Math.round(flow);
  rainCombo.classList.add('show');
  // squish animation
  makeRainBtn.classList.remove('pop');
  void makeRainBtn.offsetWidth;
  makeRainBtn.classList.add('pop');
}

// flow decays back to calm when you stop clicking
setInterval(() => {
  if (flow > 1) {
    flow = Math.max(1, flow - 0.6);
    if (flow <= 1) rainCombo.classList.remove('show');
    else rainCombo.textContent = '×' + Math.round(flow);
  }
}, 350);

// ----- Live cash counter (only goes up) -----
let cash = 4271902 + Math.floor(Math.random() * 90000);
const liveCash = document.getElementById('liveCash');
function tickCash() {
  cash += Math.floor((Math.random() * 5000 + 500) * flow);
  liveCash.textContent = '$' + cash.toLocaleString();
}
tickCash();
setInterval(tickCash, 700);

// ----- Jiggling viewer count -----
const viewersEl = document.getElementById('viewers');
let viewers = 14;
setInterval(() => {
  viewers = Math.max(7, Math.min(48, viewers + (Math.floor(Math.random() * 7) - 3)));
  viewersEl.textContent = viewers;
}, 2200);

// ----- Countdown that resets forever -----
const cd = document.getElementById('countdown');
let secs = 600;
setInterval(() => {
  secs = secs <= 0 ? 600 : secs - 1;
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  cd.textContent = `${m}:${s}`;
}, 1000);

// ----- Animated stat counters -----
const animateCount = (el) => {
  const target = +el.dataset.count;
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 60));
  const tick = () => {
    cur += step;
    if (cur >= target) { el.textContent = target.toLocaleString(); }
    else { el.textContent = cur.toLocaleString(); requestAnimationFrame(tick); }
  };
  tick();
};
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat__num').forEach((c) => obs.observe(c));

// ----- Pop-up social-proof notifications -----
const names = ['Rahul', 'Priya', 'Arjun', 'Sneha', 'Vikram', 'Ananya', 'Karthik', 'Divya', 'Rohan', 'Meera'];
const cities = ['Chennai', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Kochi', 'Jaipur'];
const acts = [
  (n, c) => `🐰 <b>${n}</b> from ${c} just hired their Bunny Buddy!<small>Happiness levels: maximum 💛</small>`,
  (n, c) => `😄 <b>${n}</b> became best friends with ${VICTIM}<small>${c} · "best decision ever"</small>`,
  (n, c) => `🥕 <b>${n}</b> upgraded to Buddy For Life<small>${c} · friendship secured 🐰</small>`,
  (n, c) => `🌟 <b>${n}</b>'s mood improved 4,000%<small>${c} · vibes definitely real</small>`,
];
const popups = document.getElementById('popups');
function showPopup() {
  const n = names[Math.floor(Math.random() * names.length)];
  const c = cities[Math.floor(Math.random() * cities.length)];
  const act = acts[Math.floor(Math.random() * acts.length)];
  const el = document.createElement('div');
  el.className = 'popup';
  el.innerHTML = act(n, c);
  popups.appendChild(el);
  setTimeout(() => el.remove(), 5200);
}
// Only start the hype pop-ups once the visitor reaches the "for rent" twist
const rentSection = document.getElementById('rent');
if (rentSection) {
  const popObs = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      showPopup();
      setInterval(showPopup, 6500);
      popObs.disconnect();
    }
  }, { threshold: 0.4 });
  popObs.observe(rentSection);
}

// ----- Photo slideshow -----
const slideshow = document.getElementById('slideshow');
if (slideshow) {
  const slides = slideshow.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('slideDots');
  let cur = 0;
  let timer;
  const render = () => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === cur));
    dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === cur));
  };
  const slideGo = (i) => { cur = (i + slides.length) % slides.length; render(); restart(); };
  const slideMove = (step) => slideGo(cur + step);
  const restart = () => { clearInterval(timer); timer = setInterval(() => slideMove(1), 4000); };
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    d.addEventListener('click', () => slideGo(i));
    dotsWrap.appendChild(d);
  });
  render();
  restart();
  // pause on hover
  slideshow.addEventListener('mouseenter', () => clearInterval(timer));
  slideshow.addEventListener('mouseleave', restart);
  window.slideMove = slideMove;
}

// ----- Empire calculator quiz -----
function calcEmpire() {
  const name = (document.getElementById('qName').value || 'Future Bestie').slice(0, 20);
  // gloriously fake math → always a great match
  const match = (95 + Math.random() * 4.9).toFixed(1);
  const res = document.getElementById('quizResult');
  res.innerHTML = `Great news, <b>${name}</b>! You and ${VICTIM} are a` +
    `<span class="big-num">${match}% match 🐰</span>This is a once-in-a-lifetime friendship. Do not let it hop away.<br>` +
    `<button class="btn btn--primary" style="margin-top:1rem" onclick="rentNow()">Hire My Bunny Buddy 🐰</button>`;
  res.classList.add('show');
}

// ====================================================================
//  THE PRANK PAYOFF
// ====================================================================
const modal = document.getElementById('modal');
const mEmoji = document.getElementById('modalEmoji');
const mTitle = document.getElementById('modalTitle');
const mText = document.getElementById('modalText');
const mActions = document.getElementById('modalActions');

const loadingLines = [
  { e: '🐰', t: 'Finding your Bunny Buddy...', s: 'Hopping through the paperwork.' },
  { e: '🥕', t: 'Loading premium good vibes...', s: 'Stocking up on carrots, just in case.' },
  { e: '💛', t: 'Measuring friendship levels...', s: 'They are off the charts.' },
  { e: '🤝', t: `Asking ${VICTIM} nicely...`, s: 'He seems suspicious but flattered.' },
];

function rentNow() {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  mActions.style.display = 'none';

  let i = 0;
  const cycle = setInterval(() => {
    const line = loadingLines[i % loadingLines.length];
    mEmoji.textContent = line.e;
    mTitle.textContent = line.t;
    mText.textContent = line.s;
    i++;
  }, 1100);

  setTimeout(() => {
    clearInterval(cycle);
    mEmoji.textContent = '🐰';
    mTitle.textContent = 'You just tried to HIRE a human bunny.';
    mText.innerHTML = `${VICTIM} is <strong>NOT</strong> for rent, for hire, or for lease — ` +
      'he is priceless and 100% free to be your friend. You got pranked! 😂<br><br>' +
      `The real Bunny Buddy was the friendship all along. 🐰💛`;
    mActions.style.display = 'flex';
    burstConfetti();
  }, 4600);
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ----- Confetti burst -----
function burstConfetti() {
  const emojis = ['🎉', '🤣', '😂', '🤡', '💀', '✨'];
  for (let i = 0; i < 45; i++) {
    const c = document.createElement('div');
    c.className = 'bill';
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-40px';
    const dur = 3 + Math.random() * 3;
    c.style.animationDuration = dur + 's';
    c.style.zIndex = 60;
    rain.appendChild(c);
    setTimeout(() => c.remove(), dur * 1000);
  }
}

// ----- "Prank a friend" share -----
function sharePrank() {
  const url = location.origin + location.pathname + '?victim=' + encodeURIComponent(VICTIM);
  const text = `😂 I just got pranked by ${VICTIM}'s cash empire. Now it's YOUR turn:`;
  if (navigator.share) {
    navigator.share({ title: `${VICTIM}™`, text, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
    alert('🔗 Link copied!\n\nChange ?victim=NAME in the link to prank a different friend.\n\n' + url);
  }
}

// ----- Downloadable "certificate" (generated as an image) -----
function downloadCert() {
  const c = document.createElement('canvas');
  c.width = 1000; c.height = 700;
  const g = c.getContext('2d');
  g.fillStyle = '#0a0612'; g.fillRect(0, 0, 1000, 700);
  g.strokeStyle = '#ffd166'; g.lineWidth = 8; g.strokeRect(30, 30, 940, 640);
  g.textAlign = 'center';
  g.fillStyle = '#ffd166'; g.font = 'bold 46px Georgia';
  g.fillText('🐰 CERTIFIED BUNNY BUDDY 🐰', 500, 150);
  g.fillStyle = '#f4f0ff'; g.font = '26px Georgia';
  g.fillText('This certifies that the bearer', 500, 250);
  g.fillStyle = '#ff4bd8'; g.font = 'bold 40px Georgia';
  g.fillText('tried to HIRE a human bunny', 500, 320);
  g.fillStyle = '#f4f0ff'; g.font = '26px Georgia';
  g.fillText(`and was lovingly pranked by ${VICTIM}™`, 500, 390);
  g.font = '20px Georgia'; g.fillStyle = '#a99fc4';
  g.fillText('Friendship level: maximum  ·  Cuteness: 100%', 500, 470);
  g.fillText('Bunny Buddy status: best friend (free of charge)', 500, 505);
  g.fillStyle = '#2ee6a0'; g.font = 'italic 22px Georgia';
  g.fillText('"The real treasure was the friendship." — ' + VICTIM, 500, 600);
  const a = document.createElement('a');
  a.href = c.toDataURL('image/png');
  a.download = `${VICTIM}-certificate-of-foolery.png`;
  a.click();
}

// ----- Smooth scroll helper -----
function go(sel) { document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }); }

// ----- Expose for inline handlers -----
Object.assign(window, { rentNow, closeModal, calcEmpire, sharePrank, downloadCert, go, makeItRain });
