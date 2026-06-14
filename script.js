// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Money rain =====
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

// ===== Animated stat counters =====
const counters = document.querySelectorAll('.stat__num');
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
  entries.forEach((e) => {
    if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
  });
}, { threshold: 0.5 });
counters.forEach((c) => obs.observe(c));

// ===== The prank payoff =====
const modal = document.getElementById('modal');
const mEmoji = document.getElementById('modalEmoji');
const mTitle = document.getElementById('modalTitle');
const mText = document.getElementById('modalText');
const mBtn = document.getElementById('modalBtn');

const loadingLines = [
  { e: '⏳', t: 'Processing your empire...', s: 'Please hold while we wire your billions.' },
  { e: '🏦', t: 'Contacting Swiss banks...', s: 'They are very impressed with you.' },
  { e: '📈', t: 'Calculating infinite ROI...', s: 'Dividing by zero. Nice.' },
  { e: '🤝', t: 'Negotiating with Ramana...', s: 'He is driving a hard bargain.' },
];

function rentNow() {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  mBtn.style.display = 'none';

  let i = 0;
  const cycle = setInterval(() => {
    const line = loadingLines[i % loadingLines.length];
    mEmoji.textContent = line.e;
    mTitle.textContent = line.t;
    mText.textContent = line.s;
    i++;
  }, 1100);

  // Reveal the prank
  setTimeout(() => {
    clearInterval(cycle);
    mEmoji.textContent = '🤡';
    mTitle.textContent = "You just tried to RENT a human being.";
    mText.innerHTML = "Ramana is <strong>NOT</strong> for sale, for rent, or for lease. " +
      "There is no empire. There is no yacht. You got pranked. 😂<br><br>" +
      "Please return Ramana to his natural habitat (the couch).";
    mBtn.style.display = 'inline-block';
    burstConfetti();
  }, 4600);
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ===== Confetti burst =====
function burstConfetti() {
  const emojis = ['🎉', '🤣', '😂', '🤡', '💀', '✨'];
  for (let i = 0; i < 40; i++) {
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

// expose for inline onclick
window.rentNow = rentNow;
window.closeModal = closeModal;
