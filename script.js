/* ==========================================================================
   Happy Birthday Muntaha - Interactive Experience & Sound Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Web Audio API - Music Synthesizer & Sound Effects
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let isMusicPlaying = false;
  let currentMelodyTimeout = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Note Frequencies in Hz
  const NOTES = {
    G3: 196.00,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50
  };

  // Music Box Chime Tone
  function playChimeNote(freq, duration = 0.4, time = 0) {
    if (!audioCtx || freq <= 0) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Harmonics for rich bell-like sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.linearRampToValueAtTime(0.22, time + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // "Happy Birthday to You" Melody Sheet
  // Format: [note, duration in seconds, pause after]
  const birthdayScore = [
    // Happy Birthday to You
    ['G4', 0.3, 0.35], ['G4', 0.3, 0.35], ['A4', 0.6, 0.65], ['G4', 0.6, 0.65], ['C5', 0.6, 0.65], ['B4', 1.1, 1.2],
    // Happy Birthday to You
    ['G4', 0.3, 0.35], ['G4', 0.3, 0.35], ['A4', 0.6, 0.65], ['G4', 0.6, 0.65], ['D5', 0.6, 0.65], ['C5', 1.1, 1.2],
    // Happy Birthday Dear Muntaha
    ['G4', 0.3, 0.35], ['G4', 0.3, 0.35], ['G5', 0.6, 0.65], ['E5', 0.6, 0.65], ['C5', 0.6, 0.65], ['B4', 0.6, 0.65], ['A4', 1.0, 1.1],
    // Happy Birthday to You
    ['F5', 0.3, 0.35], ['F5', 0.3, 0.35], ['E5', 0.6, 0.65], ['C5', 0.6, 0.65], ['D5', 0.6, 0.65], ['C5', 1.3, 1.5]
  ];

  function scheduleMelody() {
    if (!isMusicPlaying) return;
    initAudio();

    let accumulatedTime = audioCtx.currentTime + 0.1;

    birthdayScore.forEach(([noteName, dur, pause]) => {
      const freq = NOTES[noteName] || 0;
      playChimeNote(freq, dur, accumulatedTime);
      accumulatedTime += pause;
    });

    const totalDuration = (accumulatedTime - audioCtx.currentTime) * 1000;
    currentMelodyTimeout = setTimeout(() => {
      if (isMusicPlaying) {
        scheduleMelody();
      }
    }, totalDuration + 800);
  }

  function toggleMusic() {
    initAudio();
    isMusicPlaying = !isMusicPlaying;

    const musicBtn = document.getElementById('musicToggleBtn');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');

    if (isMusicPlaying) {
      musicBtn.classList.add('active');
      musicIcon.textContent = '⏸';
      musicText.textContent = 'Pause Music';
      scheduleMelody();
    } else {
      musicBtn.classList.remove('active');
      musicIcon.textContent = '🎵';
      musicText.textContent = 'Play Music';
      if (currentMelodyTimeout) {
        clearTimeout(currentMelodyTimeout);
      }
    }
  }

  // Balloon Pop Sound FX
  function playPopSound() {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {
      // Graceful fallback
    }
  }

  // Gentle blowing sound FX (filtered noise)
  function playBlowSound() {
    try {
      initAudio();
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.4);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {}
  }

  // Celebratory Fanfare Arpeggio
  function playFanfare() {
    try {
      initAudio();
      const notes = [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6];
      let t = audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        playChimeNote(freq, 0.5, t + idx * 0.12);
      });
    } catch (e) {}
  }

  // -------------------------------------------------------------------------
  // 2. High Performance Confetti Canvas Engine
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiParticles = [];
  const CONFETTI_COLORS = ['#ff3377', '#ffcc00', '#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#a855f7', '#fbbf24'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Confetti {
    constructor(x, y, isExplosion = false) {
      this.x = x !== undefined ? x : Math.random() * canvas.width;
      this.y = y !== undefined ? y : -10;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.size = Math.random() * 8 + 6;
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';

      if (isExplosion) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 5;
      } else {
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 3 + 2;
      }

      this.gravity = 0.22;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 8 - 4;
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height - 20) {
        this.opacity -= 0.04;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function launchConfettiBurst(x, y, count = 75) {
    const originX = x !== undefined ? x : canvas.width / 2;
    const originY = y !== undefined ? y : canvas.height / 2;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new Confetti(originX, originY, true));
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > canvas.height + 40) {
        confettiParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  requestAnimationFrame(animateCanvas);

  // Initial celebratory greeting burst
  setTimeout(() => {
    launchConfettiBurst(canvas.width * 0.2, canvas.height * 0.3, 40);
    launchConfettiBurst(canvas.width * 0.8, canvas.height * 0.3, 40);
  }, 600);

  // -------------------------------------------------------------------------
  // 3. Floating Balloons & Click-to-Pop Game
  // -------------------------------------------------------------------------
  const balloonsContainer = document.getElementById('balloonsContainer');
  const BALLOON_PALETTE = [
    '#ff4d88', '#9333ea', '#38bdf8', '#f59e0b', '#10b981', '#fb7185', '#6366f1'
  ];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';

    const color = BALLOON_PALETTE[Math.floor(Math.random() * BALLOON_PALETTE.length)];
    balloon.style.backgroundColor = color;
    balloon.style.left = Math.floor(Math.random() * 88 + 5) + 'vw';

    const duration = Math.random() * 8 + 12;
    balloon.style.animationDuration = duration + 's';

    const knot = document.createElement('div');
    knot.className = 'balloon-knot';
    balloon.appendChild(knot);

    // Pop on Click
    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      playPopSound();
      const rect = balloon.getBoundingClientRect();
      launchConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      balloon.remove();
    });

    balloonsContainer.appendChild(balloon);

    // Cleanup when animated out
    setTimeout(() => {
      if (balloon.parentElement) {
        balloon.remove();
      }
    }, duration * 1000);
  }

  // Spawn initial set and continuous flow
  for (let i = 0; i < 7; i++) {
    setTimeout(createBalloon, i * 1400);
  }
  setInterval(createBalloon, 2800);

  // -------------------------------------------------------------------------
  // 4. Interactive Cake: Blowing & Cutting
  // -------------------------------------------------------------------------
  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const relightCandlesBtn = document.getElementById('relightCandlesBtn');
  const cutCakeBtn = document.getElementById('cutCakeBtn');
  const cakeStatusText = document.getElementById('cakeStatusText');
  const cakeSliceModal = document.getElementById('cakeSliceModal');
  const closeSliceBtn = document.getElementById('closeSliceBtn');

  const flames = [
    document.getElementById('flame1'),
    document.getElementById('flame2'),
    document.getElementById('flame3')
  ];
  const smokes = [
    document.getElementById('smoke1'),
    document.getElementById('smoke2'),
    document.getElementById('smoke3')
  ];

  function blowCandles() {
    playBlowSound();

    flames.forEach(flame => flame.classList.add('extinguished'));
    smokes.forEach(smoke => smoke.classList.add('rise'));

    setTimeout(() => {
      playFanfare();
      launchConfettiBurst(canvas.width / 2, canvas.height * 0.45, 90);
      launchConfettiBurst(canvas.width * 0.3, canvas.height * 0.5, 50);
      launchConfettiBurst(canvas.width * 0.7, canvas.height * 0.5, 50);

      cakeStatusText.innerHTML = '🎉 <strong>Woohoo! Happy Birthday Muntaha!</strong> May every single one of your wishes blossom into reality! ✨💖';
      blowCandlesBtn.classList.add('hidden');
      relightCandlesBtn.classList.remove('hidden');
    }, 400);
  }

  function relightCandles() {
    flames.forEach(flame => flame.classList.remove('extinguished'));
    smokes.forEach(smoke => smoke.classList.remove('rise'));

    cakeStatusText.textContent = 'The candles are burning bright again! Make another wish! ✨';
    blowCandlesBtn.classList.remove('hidden');
    relightCandlesBtn.classList.add('hidden');
  }

  function cutCake() {
    playFanfare();
    launchConfettiBurst(canvas.width / 2, canvas.height * 0.55, 45);
    cakeSliceModal.classList.remove('hidden');
    cakeSliceModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  blowCandlesBtn.addEventListener('click', blowCandles);
  relightCandlesBtn.addEventListener('click', relightCandles);
  cutCakeBtn.addEventListener('click', cutCake);
  closeSliceBtn.addEventListener('click', () => {
    cakeSliceModal.classList.add('hidden');
  });

  // Candle direct clicks to blow individual flames
  flames.forEach(flame => {
    flame.parentElement.addEventListener('click', () => {
      blowCandles();
    });
  });

  // -------------------------------------------------------------------------
  // 5. 3D Surprise Gift Box Unwrapping
  // -------------------------------------------------------------------------
  const giftBox = document.getElementById('giftBox');
  const birthdayLetter = document.getElementById('birthdayLetter');
  const giftHint = document.getElementById('giftHint');
  let isGiftOpened = false;

  function openGiftBox() {
    if (isGiftOpened) return;
    isGiftOpened = true;

    playFanfare();
    giftBox.classList.add('opened');
    giftHint.textContent = '🎊 Surprise Unlocked!';

    const rect = giftBox.getBoundingClientRect();
    launchConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);

    setTimeout(() => {
      birthdayLetter.classList.remove('hidden');
      birthdayLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  }

  giftBox.addEventListener('click', openGiftBox);
  giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openGiftBox();
    }
  });

  // -------------------------------------------------------------------------
  // 6. Wishes Wall & Persistence
  // -------------------------------------------------------------------------
  const wishForm = document.getElementById('wishForm');
  const wishesGrid = document.getElementById('wishesGrid');
  const STORAGE_KEY = 'muntaha_birthday_wishes_data';

  // Load custom wishes from localStorage
  function loadWishes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const list = JSON.parse(saved);
        list.forEach(item => appendWishCard(item.author, item.message, item.theme, false));
      }
    } catch (e) {}
  }

  function appendWishCard(author, message, theme, save = true) {
    const card = document.createElement('div');
    card.className = `wish-card ${theme}`;

    const icons = {
      'card-pink': '🌸',
      'card-purple': '💜',
      'card-gold': '✨',
      'card-cyan': '🌊'
    };

    card.innerHTML = `
      <div class="card-icon">${icons[theme] || '💌'}</div>
      <h4>From ${escapeHtml(author)}</h4>
      <p>“${escapeHtml(message)}”</p>
      <div class="card-author">— Posted with love</div>
    `;

    wishesGrid.appendChild(card);

    if (save) {
      try {
        const currentWishes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        currentWishes.push({ author, message, theme });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWishes));
      } catch (e) {}
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('authorInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();
    const theme = document.getElementById('cardThemeSelect').value;

    if (!author || !message) return;

    appendWishCard(author, message, theme, true);
    playFanfare();
    launchConfettiBurst(canvas.width / 2, canvas.height * 0.7, 40);

    wishForm.reset();
  });

  loadWishes();

  // -------------------------------------------------------------------------
  // 7. Header Controls (Music & Confetti Popper)
  // -------------------------------------------------------------------------
  document.getElementById('musicToggleBtn').addEventListener('click', toggleMusic);
  document.getElementById('popperBtn').addEventListener('click', (e) => {
    playFanfare();
    launchConfettiBurst(e.clientX, e.clientY, 80);
  });
});
