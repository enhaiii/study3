(function () {
  document.addEventListener('DOMContentLoaded', function () {
    console.log('%c[REFLEX ARENA] %cВсе системы активированы.',
      'color: #00f3ff; font-weight: bold;', 'color: #e0f0ff;');

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
      }
    });

    const savedUser = getCurrentUser();
    if (!savedUser && window.gameAPI && typeof window.gameAPI.resetGame === 'function') {
      window.gameAPI.resetGame();
      const canvas = document.getElementById('game-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
        e.target.classList.remove('active');
      }
    });
  });
})();