const sneakyButton = document.getElementById('sneakyButton');
const playground = document.getElementById('playground');
const hint = document.getElementById('hint');
const counter = document.getElementById('counter');
const realButton = document.getElementById('realButton');
const welcome = document.getElementById('welcome');
const letter = document.getElementById('letter');
const celebrateButton = document.getElementById('celebrateButton');
const confettiLayer = document.getElementById('confettiLayer');

let attempts = 0;
const maxAttempts = 3;

function moveButton() {
  if (attempts >= maxAttempts) return;
  attempts += 1;

  const area = playground.getBoundingClientRect();
  const button = sneakyButton.getBoundingClientRect();
  const maxX = Math.max(0, area.width - button.width);
  const maxY = Math.max(0, area.height - button.height);
  const currentX = button.left - area.left;
  const currentY = button.top - area.top;
  const minJump = Math.min(80, Math.hypot(maxX, maxY) * 0.45);
  let nextX = currentX;
  let nextY = currentY;
  let foundJump = false;

  for (let i = 0; i < 30; i += 1) {
    nextX = Math.random() * maxX;
    nextY = Math.random() * maxY;
    if (Math.hypot(nextX - currentX, nextY - currentY) >= minJump) {
      foundJump = true;
      break;
    }
  }

  if (!foundJump) {
    const corners = [[0, 0], [maxX, 0], [0, maxY], [maxX, maxY]];
    [nextX, nextY] = corners.reduce((farthest, point) =>
      Math.hypot(point[0] - currentX, point[1] - currentY) >
      Math.hypot(farthest[0] - currentX, farthest[1] - currentY) ? point : farthest
    );
  }

  sneakyButton.style.left = `${nextX}px`;
  sneakyButton.style.top = `${nextY}px`;
  sneakyButton.style.transform = 'none';

  const messages = [
    'Ha! Amper! Probeer weer. 😜',
    'Oe, jy is vinnig! Nog een kans...',
    'Goed, goed — jy het gewen! 🎉'
  ];
  hint.textContent = messages[attempts - 1];
  counter.textContent = `${attempts} van ${maxAttempts} pogings`;

  if (attempts === maxAttempts) {
    sneakyButton.classList.add('hidden');
    hint.textContent = 'Ek gee oor. Jou regte geskenk is gereed! 💗';
    realButton.classList.remove('hidden');
    counter.textContent = '';
  }
}

// On a computer the button dodges the pointer; on touchscreens each tap counts.
sneakyButton.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse' && attempts < maxAttempts) moveButton();
});
sneakyButton.addEventListener('click', () => {
  if (attempts < maxAttempts) moveButton();
});

realButton.addEventListener('click', () => {
  welcome.classList.add('hidden');
  letter.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  launchConfetti(100);
});
celebrateButton.addEventListener('click', () => launchConfetti(150));

function launchConfetti(amount) {
  const colors = ['#ff8eae','#b7a2f5','#ffe28c','#bcebdc','#ffad75','#8dc9f5'];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--duration', `${2.2 + Math.random() * 2.8}s`);
    piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    piece.style.animationDelay = `${Math.random() * .8}s`;
    if (Math.random() > .55) {
      piece.style.width = '7px'; piece.style.height = '7px'; piece.style.borderRadius = '50%';
    }
    confettiLayer.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}
window.addEventListener('load', () => setTimeout(() => launchConfetti(24), 350));
