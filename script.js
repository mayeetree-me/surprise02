// ═══════════════════════════════════════
//  SURPRISE PAGE — Main Controller
// ═══════════════════════════════════════

const App = {
  currentStage: 0,
  stages: ['stage-envelope', 'stage-letter', 'stage-question', 'stage-celebration', 'stage-proposal'],
  canvas: null,
  ctx: null,
  particles: [],
  animFrame: null,
  confettiActive: false,
  heartsActive: true,

  init() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.showStage(0);
    this.startHearts();
    this.bindEvents();
    this.animate();
  },

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  // ─── Stage Management ───
  showStage(index) {
    this.stages.forEach((id, i) => {
      const el = document.getElementById(id);
      if (i === index) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    this.currentStage = index;

    // Trigger stage-specific logic
    if (index === 1) this.startLetter();
    if (index === 3) this.startCelebration();
    if (index === 4) this.startProposal();
  },

  transitionTo(index) {
    const current = document.getElementById(this.stages[this.currentStage]);
    current.style.opacity = '0';
    setTimeout(() => {
      current.classList.remove('active');
      current.style.opacity = '';
      this.showStage(index);
    }, 800);
  },

  // ─── Event Bindings ───
  bindEvents() {
    // Stage 1: Envelope click
    const envelope = document.querySelector('.envelope-container');
    envelope.addEventListener('click', () => {
      envelope.classList.add('opening');
      setTimeout(() => this.transitionTo(1), 1200);
    });

    // Stage 2: Continue button
    document.querySelector('.letter-continue-btn').addEventListener('click', () => {
      this.transitionTo(2);
    });

    // Stage 3: Yes button
    document.querySelector('.btn-yes').addEventListener('click', () => {
      this.confettiActive = true;
      this.launchConfetti();
      setTimeout(() => this.transitionTo(3), 1500);
    });

    // Stage 3: No button dodge
    const noBtn = document.querySelector('.btn-no');
    let noDodgeCount = 0;
    const noMessages = [
      "Are you sure? 🥺",
      "Think again! 💕",
      "Wrong button, baby! 😘",
      "You can't click this! 😜",
      "Try the other one! 💖",
      "Nope! Not allowed! 🙈",
      "I'll keep running! 🏃‍♀️",
      "Hehe, nice try! 😏",
      "That's not the right answer! 💗",
      "You know the answer... 🥰"
    ];

    const dodgeNo = (e) => {
      e.preventDefault();
      noDodgeCount++;
      const msgEl = document.querySelector('.no-message');
      msgEl.textContent = noMessages[noDodgeCount % noMessages.length];
      msgEl.classList.add('visible');
      setTimeout(() => msgEl.classList.remove('visible'), 1500);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const btnW = noBtn.offsetWidth;
      const btnH = noBtn.offsetHeight;
      const x = Math.random() * (vw - btnW - 40) + 20;
      const y = Math.random() * (vh - btnH - 40) + 20;
      noBtn.style.position = 'fixed';
      noBtn.style.left = x + 'px';
      noBtn.style.top = y + 'px';

      // Shrink and speed up
      const scale = Math.max(0.5, 1 - noDodgeCount * 0.05);
      noBtn.style.transform = `scale(${scale})`;
      noBtn.style.transition = `all ${Math.max(0.1, 0.3 - noDodgeCount * 0.02)}s ease`;
    };

    noBtn.addEventListener('mouseenter', dodgeNo);
    noBtn.addEventListener('touchstart', dodgeNo, { passive: false });

    // Stage 4: One more thing
    document.querySelector('.btn-one-more').addEventListener('click', () => {
      this.confettiActive = false;
      this.transitionTo(4);
    });

    // Stage 5: Final Button
    document.querySelector('.btn-final').addEventListener('click', () => {
      this.confettiActive = true;
      this.launchConfetti();
      for (let i = 0; i < 20; i++) setTimeout(() => this.spawnHeart(), i * 50);
    });

    // Music toggle
    const musicBtn = document.querySelector('.music-toggle');
    const audio = document.getElementById('bg-music');
    let musicPlaying = false;
    musicBtn.addEventListener('click', () => {
      if (musicPlaying) {
        audio.pause();
        musicBtn.textContent = '🔇';
      } else {
        audio.play().catch(() => {});
        musicBtn.textContent = '🎵';
      }
      musicPlaying = !musicPlaying;
    });
  },

  // ─── Love Letter Typewriter ───
  startLetter() {
    const lines = document.querySelectorAll('.letter-body .line');
    const sign = document.querySelector('.letter-sign');
    const btn = document.querySelector('.letter-continue-btn');
    let delay = 300;

    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, delay + i * 200);
    });

    const totalTime = delay + lines.length * 200 + 300;
    setTimeout(() => {
      sign.classList.add('visible');
    }, totalTime);
    setTimeout(() => {
      btn.style.display = 'inline-block';
      // smoothly scroll the button into view if it is not visible
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, totalTime + 400);
  },

  // ─── Celebration ───
  startCelebration() {
    this.confettiActive = true;
    this.launchConfetti();

    // Show one-more button after delay
    setTimeout(() => {
      const btn = document.querySelector('.btn-one-more');
      btn.style.display = 'inline-block';
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2500);
  },

  // ─── Proposal ───
  startProposal() {
    this.heartsActive = true;
    this.confettiActive = false;
  },

  // ═══════════════════════════════════════
  //  PARTICLE SYSTEM
  // ═══════════════════════════════════════
  startHearts() {
    this.heartsActive = true;
  },

  launchConfetti() {
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        type: 'confetti',
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: ['#ff6b9d', '#f8b500', '#ff3d7f', '#ffe066', '#c44569', '#ff9ff3', '#feca57'][Math.floor(Math.random() * 7)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
        decay: 0.002 + Math.random() * 0.003
      });
    }
  },

  spawnHeart() {
    this.particles.push({
      type: 'heart',
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.5 + 0.5),
      size: Math.random() * 14 + 6,
      color: ['#ff6b9d', '#c44569', '#ff9ff3', '#ff3d7f'][Math.floor(Math.random() * 4)],
      life: 1,
      decay: 0.003 + Math.random() * 0.003,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02
    });
  },

  drawHeart(x, y, size, color) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    const s = size / 2;
    this.ctx.moveTo(0, s * 0.4);
    this.ctx.bezierCurveTo(-s, -s * 0.4, -s, -s, 0, -s * 0.5);
    this.ctx.bezierCurveTo(s, -s, s, -s * 0.4, 0, s * 0.4);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = 0.6;
    this.ctx.fill();
    this.ctx.restore();
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Spawn floating hearts occasionally
    if (this.heartsActive && Math.random() < 0.03) {
      this.spawnHeart();
    }

    // Update & draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.type === 'heart') {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
        p.y += p.vy;
        this.ctx.globalAlpha = p.life * 0.6;
        this.drawHeart(p.x, p.y, p.size, p.color);
        this.ctx.globalAlpha = 1;
      }

      if (p.type === 'confetti') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        this.ctx.restore();
      }
    }

    // Keep spawning confetti if active
    if (this.confettiActive && Math.random() < 0.15) {
      this.particles.push({
        type: 'confetti',
        x: Math.random() * this.canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1,
        size: Math.random() * 8 + 3,
        color: ['#ff6b9d', '#f8b500', '#ff3d7f', '#ffe066', '#c44569', '#ff9ff3', '#feca57'][Math.floor(Math.random() * 7)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        life: 1,
        decay: 0.004 + Math.random() * 0.004
      });
    }

    this.animFrame = requestAnimationFrame(() => this.animate());
  }
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
