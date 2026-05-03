(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const closeBtn = document.getElementById('close-leaderboard-btn');
    const modal = document.getElementById('leaderboard-modal');

    if (leaderboardBtn) {
      leaderboardBtn.addEventListener('click', openLeaderboard);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLeaderboard);
    }
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeLeaderboard();
        }
      });
    }
  });

  function openLeaderboard() {
    const modal = document.getElementById('leaderboard-modal');
    const tbody = document.getElementById('leaderboard-body');
    if (!modal || !tbody) return;

    const entries = getLeaderboard();
    renderLeaderboard(tbody, entries);
    modal.classList.add('active');
  }

  function closeLeaderboard() {
    const modal = document.getElementById('leaderboard-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /**
   * Заполняет <tbody> данными таблицы.
   * @param {HTMLElement} tbody
   * @param {Array} entries
   */
  function renderLeaderboard(tbody, entries) {
    tbody.innerHTML = '';

    if (entries.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="5" style="text-align:center; color:#7a8a9a;">Нет записей</td>`;
      tbody.appendChild(row);
      return;
    }

    entries.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${escapeHtml(entry.username)}</td>
        <td>${entry.score}</td>
        <td>${entry.avgReaction != null ? Math.round(entry.avgReaction) : '-'}</td>
        <td>${entry.date || '-'}</td>
      `;
      tbody.appendChild(row);
    });
  }

  /**
   * Простейшее экранирование HTML для безопасности.
   * @param {string} text
   * @returns {string}
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Глобальная функция для обновления таблицы извне (например, после добавления результата).
   * Может быть вызвана из game.js.
   */
  window.refreshLeaderboard = function () {
    const tbody = document.getElementById('leaderboard-body');
    if (tbody) {
      const entries = getLeaderboard();
      renderLeaderboard(tbody, entries);
    }
  };
})();