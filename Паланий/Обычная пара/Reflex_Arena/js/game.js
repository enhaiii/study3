(function () {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  const startBtn = document.getElementById('start-game-btn');
  const hpDisplay = document.getElementById('hp-value');
  const scoreDisplay = document.getElementById('score-value');
  const gameMessage = document.getElementById('game-message');
  const resultModal = document.getElementById('result-modal');
  const closeResultBtn = document.getElementById('close-result-btn');

  const finalScoreEl = document.getElementById('final-score');
  const finalAccuracyEl = document.getElementById('final-accuracy');
  const finalReactionEl = document.getElementById('final-reaction');
  const finalDamageEl = document.getElementById('final-damage');

  let gameActive = false;
  let animFrameId = null;

  let hp = 100;
  let score = 0;
  let targets = [];
  let reactionTimes = [];
  let normalSpawned = 0;
  let normalHits = 0;

  let difficulty = 'easy';
  let mapType = 'standard';

  const DIFFICULTY_SETTINGS = {
    easy:   { maxLife: 2000, spawnInterval: 1000, decoyChance: 0.2 },
    normal: { maxLife: 1500, spawnInterval: 800,  decoyChance: 0.3 },
    hard:   { maxLife: 900,  spawnInterval: 600,  decoyChance: 0.4 }
  };

  let spawnTimer = 0;
  let lastTimestamp = 0;

  class Target {
    constructor(x, y, type, maxLife) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.maxLife = maxLife;
      this.life = maxLife;
      this.baseRadius = 35;
      this.radius = this.baseRadius;
      this.spawnTime = performance.now();
    }

    /**
     * Обновление состояния цели (уменьшение времени жизни и размера)
     * @param {number} dt - время с прошлого кадра в мс
     */
    update(dt) {
      this.life -= dt;
      this.radius = Math.max(0, this.baseRadius * (this.life / this.maxLife));
    }

    draw(ctx) {
      if (this.radius <= 0) return;

      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;

      if (this.type === 'normal') {
        this.drawRing(ctx, '#00f3ff', this.radius);
        this.drawRing(ctx, '#00f3ff', this.radius * 0.7);
        this.drawRing(ctx, '#ffffff', this.radius * 0.3);
      } else {
        this.drawRing(ctx, '#ff3366', this.radius);
        this.drawRing(ctx, '#ff6699', this.radius * 0.65);
        this.drawRing(ctx, '#ffffff', this.radius * 0.25);
      }

      ctx.restore();
    }

    drawRing(ctx, color, radius) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    containsPoint(px, py) {
      const dx = px - this.x;
      const dy = py - this.y;
      return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
  }

  function getSpawnPosition() {
    const margin = 40;
    const w = canvas.width;
    const h = canvas.height;

    let x, y;

    switch (mapType) {
      case 'corners':
        const corner = Math.floor(Math.random() * 4);
        const qw = w / 3;
        const qh = h / 3;
        x = (corner % 2 === 0)
          ? margin + Math.random() * (qw - margin)
          : w - qw + Math.random() * (qw - margin);
        y = (corner < 2)
          ? margin + Math.random() * (qh - margin)
          : h - qh + Math.random() * (qh - margin);
        break;

      case 'center':
        const cw = w / 3;
        const ch = h / 3;
        x = (w - cw) / 2 + Math.random() * cw;
        y = (h - ch) / 2 + Math.random() * ch;
        break;

      case 'standard':
      default:
        x = margin + Math.random() * (w - 2 * margin);
        y = margin + Math.random() * (h - 2 * margin);
        break;
    }

    return { x, y };
  }

  function spawnTarget() {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const type = (Math.random() < settings.decoyChance) ? 'decoy' : 'normal';
    const { x, y } = getSpawnPosition();

    const target = new Target(x, y, type, settings.maxLife);
    targets.push(target);

    if (type === 'normal') {
      normalSpawned++;
    }
  }

  function dealDamage(amount) {
    if (!gameActive) return;
    hp = Math.max(0, hp - amount);
    updateStatsDisplay();

    if (hp <= 0) {
      endGame();
    }
  }

  function endGame() {
    gameActive = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    const avgReaction = reactionTimes.length
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    const accuracy = normalSpawned > 0
      ? (normalHits / normalSpawned) * 100
      : 0;

    const damageTaken = 100 - hp;

    finalScoreEl.textContent = score;
    finalAccuracyEl.textContent = accuracy.toFixed(1) + '%';
    finalReactionEl.textContent = Math.round(avgReaction) + ' мс';
    finalDamageEl.textContent = damageTaken;

    resultModal.classList.add('active');

    const currentUser = getCurrentUser();
    if (currentUser) {
      addLeaderboardEntry({
        username: currentUser,
        score: score,
        avgReaction: avgReaction,
        date: new Date().toLocaleString()
      });
      if (typeof window.refreshLeaderboard === 'function') {
        window.refreshLeaderboard();
      }
    }
  }

  function resetGameState() {
    gameActive = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    hp = 100;
    score = 0;
    targets = [];
    reactionTimes = [];
    normalSpawned = 0;
    normalHits = 0;
    spawnTimer = 0;
    updateStatsDisplay();
    gameMessage.textContent = '';
  }

  function gameLoop(timestamp) {
    if (!gameActive) return;

    if (lastTimestamp === 0) {
      lastTimestamp = timestamp;
      animFrameId = requestAnimationFrame(gameLoop);
      drawScene();
      return;
    }

    let dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (dt > 1000) dt = 1000;

    const settings = DIFFICULTY_SETTINGS[difficulty];
    spawnTimer += dt;
    while (spawnTimer >= settings.spawnInterval) {
      spawnTarget();
      spawnTimer -= settings.spawnInterval;
    }

    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      target.update(dt);

      if (target.life <= 0) {
        if (target.type === 'normal') {
          dealDamage(10);
        }
        targets.splice(i, 1);
      }
    }

    drawScene();

    animFrameId = requestAnimationFrame(gameLoop);
  }

  function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    targets.forEach(target => target.draw(ctx));
  }

  canvas.addEventListener('click', function (e) {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let hit = false;
    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      if (target.containsPoint(mouseX, mouseY)) {
        // Попадание
        if (target.type === 'normal') {
          score++;
          normalHits++;
          const reaction = performance.now() - target.spawnTime;
          reactionTimes.push(reaction);
        } else if (target.type === 'decoy') {
          dealDamage(5);
        }
        gameMessage.textContent = target.type === 'normal' ? 'Попадание!' : 'Ложная цель!';
        targets.splice(i, 1);
        hit = true;
        updateStatsDisplay();
        break;
      }
    }

    if (!hit) {
      gameMessage.textContent = 'Промах!';
    }
  });

  function updateStatsDisplay() {
    hpDisplay.textContent = hp;
    scoreDisplay.textContent = score;
  }

  function startGame() {
    resetGameState();
    gameActive = true;
    lastTimestamp = 0;
    animFrameId = requestAnimationFrame(gameLoop);
    gameMessage.textContent = 'ИГРА НАЧАЛАСЬ';
  }

  startBtn.addEventListener('click', startGame);

  closeResultBtn.addEventListener('click', function () {
    resultModal.classList.remove('active');
    drawScene();
  });

  resultModal.addEventListener('click', function (e) {
    if (e.target === resultModal) {
      resultModal.classList.remove('active');
      drawScene();
    }
  });

  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      difficulty = this.dataset.diff;
      gameMessage.textContent = 'Сложность: ' + difficulty.toUpperCase();
    });
  });

  document.querySelectorAll('.map-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      mapType = this.dataset.map;
      gameMessage.textContent = 'Карта: ' + mapType.toUpperCase();
    });
  });

  drawScene();

  window.gameAPI = {
    resetGame: resetGameState,
    startGame: startGame
  };
})();