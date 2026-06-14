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
const bills = ['💵', '💸', '🤑', '💰', '🪙'];
function spawnBill() {
  const b = document.createElement('div');
  b.className = 'bill';
  b.textContent = bills[Math.floor(Math.random() * bills.length)];
  b.style.left = Math.random() * 100 + 'vw';
  const dur = 4 + Math.random() * 6;
  b.style.animationDuration = dur + 's';
  b.style.fontSize = 18 + Math.random() * 22 + 'px';
  rain.appendChild(b);
  setTimeout(() => b.remove(), dur * 1000);
}
setInterval(spawnBill, 450);

// ----- Live cash counter (only goes up) -----
let cash = 4271902 + Math.floor(Math.random() * 90000);
const liveCash = document.getElementById('liveCash');
function tickCash() {
  cash += Math.floor(Math.random() * 5000) + 500;
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

// ----- Empire-O-Meter (fills as you stay / click) -----
let meterPct = 3;
const gaugeFill = document.getElementById('gaugeFill');
const gaugeVal = document.getElementById('gaugeVal');
function renderMeter() {
  gaugeFill.style.width = meterPct + '%';
  gaugeVal.textContent = meterPct.toFixed(0);
}
setInterval(() => { if (meterPct < 97) { meterPct += 0.4; renderMeter(); } }, 1200);
function boostMeter() {
  meterPct = Math.min(99, meterPct + 8 + Math.random() * 6);
  renderMeter();
  if (meterPct >= 99) {
    setTimeout(() => alert('🎉 99% there! The final 1% requires renting ' + VICTIM + '. Go on. Click it.'), 200);
  }
}
renderMeter();

// ----- Live RMNA "stock" chart (always trending up) -----
const canvas = document.getElementById('stockChart');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;
let pts = [];
let coinVal = 1.0;
for (let i = 0; i < 60; i++) { pts.push(0.2 + i * 0.012 + Math.random() * 0.05); }
const coinPrice = document.getElementById('coinPrice');
function drawChart() {
  ctx.clearRect(0, 0, W, H);
  const max = Math.max(...pts), min = Math.min(...pts);
  const x = (i) => (i / (pts.length - 1)) * W;
  const y = (v) => H - ((v - min) / (max - min || 1)) * (H - 20) - 10;
  // area fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(46,230,160,0.35)');
  grad.addColorStop(1, 'rgba(46,230,160,0)');
  ctx.beginPath();
  ctx.moveTo(0, H);
  pts.forEach((v, i) => ctx.lineTo(x(i), y(v)));
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  // line
  ctx.beginPath();
  pts.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
  ctx.strokeStyle = '#2ee6a0';
  ctx.lineWidth = 2.5;
  ctx.stroke();
}
function tickChart() {
  const last = pts[pts.length - 1];
  pts.push(last + 0.01 + Math.random() * 0.06); // only up
  pts.shift();
  coinVal += 0.01 + Math.random() * 0.08;
  coinPrice.textContent = '$' + coinVal.toFixed(2);
  drawChart();
}
drawChart();
setInterval(tickChart, 900);

// ----- Pop-up social-proof notifications -----
const names = ['Rahul', 'Priya', 'Arjun', 'Sneha', 'Vikram', 'Ananya', 'Karthik', 'Divya', 'Rohan', 'Meera'];
const cities = ['Chennai', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Kochi', 'Jaipur'];
const acts = [
  (n, c) => `🤝 <b>${n}</b> from ${c} just rented ${VICTIM}!<small>Made ₹40 lakh in 4 minutes 🚀</small>`,
  (n, c) => `🪙 <b>${n}</b> bought 9,000 RMNA coins<small>${c} · "to the moon" 🌕</small>`,
  (n, c) => `🏝️ <b>${n}</b> upgraded to Galactic Overlord<small>${c} · now owns an island*</small>`,
  (n, c) => `📈 <b>${n}</b>'s empire grew 4,000%<small>${c} · numbers definitely real</small>`,
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
setTimeout(showPopup, 3000);
setInterval(showPopup, 6500);

// ----- Empire calculator quiz -----
function calcEmpire() {
  const name = (document.getElementById('qName').value || 'Future Mogul').slice(0, 20);
  const cashIn = Math.max(0, +document.getElementById('qCash').value || 100);
  // gloriously fake math
  const worth = Math.floor((cashIn + 100) * 99999 + Math.random() * 9000000);
  const crore = (worth / 10000000).toFixed(1);
  const res = document.getElementById('quizResult');
  res.innerHTML = `Congratulations, <b>${name}</b>! With ${VICTIM} on your team you'll be worth` +
    `<span class="big-num">₹${crore} crore</span>by next Tuesday. 📈<br>` +
    `<button class="btn btn--primary" style="margin-top:1rem" onclick="rentNow()">Lock In My Empire 🔒</button>`;
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
  { e: '⏳', t: 'Processing your empire...', s: 'Please hold while we wire your billions.' },
  { e: '🏦', t: 'Contacting Swiss banks...', s: 'They are very impressed with you.' },
  { e: '📈', t: 'Calculating infinite ROI...', s: 'Dividing by zero. Nice.' },
  { e: '🤝', t: `Negotiating with ${VICTIM}...`, s: 'He is driving a hard bargain.' },
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
    mEmoji.textContent = '🤡';
    mTitle.textContent = 'You just tried to RENT a human being.';
    mText.innerHTML = `${VICTIM} is <strong>NOT</strong> for sale, for rent, or for lease. ` +
      'There is no empire. There is no yacht. You got pranked. 😂<br><br>' +
      `Please return ${VICTIM} to his natural habitat (the couch).`;
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
  g.fillText('🏆 CERTIFICATE OF FOOLERY 🏆', 500, 150);
  g.fillStyle = '#f4f0ff'; g.font = '26px Georgia';
  g.fillText('This certifies that the bearer', 500, 250);
  g.fillStyle = '#ff4bd8'; g.font = 'bold 40px Georgia';
  g.fillText('attempted to RENT a human being', 500, 320);
  g.fillStyle = '#f4f0ff'; g.font = '26px Georgia';
  g.fillText(`and was successfully pranked by ${VICTIM}™`, 500, 390);
  g.font = '20px Georgia'; g.fillStyle = '#a99fc4';
  g.fillText('Net worth gained: ₹0 crore  ·  Dignity remaining: 0%', 500, 470);
  g.fillText('Empire status: imaginary', 500, 505);
  g.fillStyle = '#2ee6a0'; g.font = 'italic 22px Georgia';
  g.fillText('"Trust the process." — ' + VICTIM, 500, 600);
  const a = document.createElement('a');
  a.href = c.toDataURL('image/png');
  a.download = `${VICTIM}-certificate-of-foolery.png`;
  a.click();
}

// ----- Smooth scroll helper -----
function go(sel) { document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }); }

// ----- Expose for inline handlers -----
Object.assign(window, { rentNow, closeModal, boostMeter, calcEmpire, sharePrank, downloadCert, go });
