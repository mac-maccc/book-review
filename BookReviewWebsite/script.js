/* =============================================
   BOOK REVIEW — ONCE by James Herbert
   script.js
   ============================================= */

// ── Particle System ──────────────────────────
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = randomBetween(0, W);
      this.y = randomBetween(0, H);
      this.size = randomBetween(0.4, 1.6);
      this.speedY = randomBetween(-0.15, -0.5);
      this.speedX = randomBetween(-0.1, 0.1);
      this.life = 0;
      this.maxLife = randomBetween(120, 280);
      this.color = `hsl(${randomBetween(30, 50)}, ${randomBetween(40, 70)}%, ${randomBetween(55, 80)}%)`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => {
      const p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife); // stagger start
      return p;
    });
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('DOMContentLoaded', init);
})();


// ── Book Cover 3D Tilt ────────────────────────
(function () {
  const wrapper = document.querySelector('.cover-wrapper');
  const inner   = document.querySelector('.cover-inner');
  if (!wrapper || !inner) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    inner.style.transform = `rotateY(${-4 + dx * 12}deg) rotateX(${-dy * 8}deg) translateY(-4px)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateY(-8deg) rotateX(2deg)';
  });
})();


// ── Start Reading Button ──────────────────────
function openBook() {
  // Save music position so main page can resume from same spot
  const music = document.getElementById('bgMusic');
  if (music) {
    sessionStorage.setItem('bgMusicTime', music.currentTime);
    sessionStorage.setItem('bgMusicMuted', music.paused ? '1' : '0');
  }

  const pageTurn = document.getElementById('pageTurn');
  pageTurn.classList.add('active');
  setTimeout(() => {
    window.location.href = 'main.html';
  }, 800);
}


// ── Subtle parallax on scroll/mouse ──────────
document.addEventListener('mousemove', (e) => {
  const xFrac = (e.clientX / window.innerWidth  - 0.5) * 2;
  const yFrac = (e.clientY / window.innerHeight - 0.5) * 2;

  const fog1 = document.querySelector('.fog-1');
  const fog2 = document.querySelector('.fog-2');
  if (fog1) fog1.style.transform = `translateX(${xFrac * 10}px) translateY(${yFrac * 5}px)`;
  if (fog2) fog2.style.transform = `translateX(${-xFrac * 8}px) translateY(${-yFrac * 4}px)`;
});

// ── Background Music ─────────────────────────
(function () {
  const music   = document.getElementById('bgMusic');
  const btn     = document.getElementById('musicBtn');
  const icon    = document.getElementById('musicIcon');
  const label   = document.getElementById('musicLabel');
  if (!music || !btn) return;

  let musicStarted = false;
  let isMuted = false;

  // Browsers block autoplay until user interacts — start on first interaction
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    music.volume = 0;
    music.play().then(() => {
      // Fade in gently
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(0.4, vol + 0.01);
        music.volume = vol;
        if (vol >= 0.4) clearInterval(fadeIn);
      }, 60);
    }).catch(() => {
      // Autoplay blocked — user must click the music button manually
    });
  }

  // Start on any first interaction with the page
  ['click', 'keydown', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, startMusic, { once: true });
  });

  // Toggle button
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // don't double-trigger startMusic
    if (!musicStarted) {
      // Manual first start
      musicStarted = true;
      music.volume = 0;
      music.play().then(() => {
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(0.4, vol + 0.01);
          music.volume = vol;
          if (vol >= 0.4) clearInterval(fadeIn);
        }, 60);
      }).catch(() => {});
      isMuted = false;
    } else {
      isMuted = !isMuted;
      if (isMuted) {
        music.pause();
        btn.classList.add('muted');
        icon.textContent = '♩';
        label.textContent = 'MUSIC OFF';
      } else {
        music.play();
        btn.classList.remove('muted');
        icon.textContent = '♪';
        label.textContent = 'MUSIC ON';
      }
    }
  });
})();