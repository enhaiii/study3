const USERS_KEY = 'reflex_users';
const CURRENT_USER_KEY = 'reflex_current';
const LEADERBOARD_KEY = 'reflex_leaderboard';

/**
 * Получить объект со всеми пользователями
 * @returns {Object} { username: password, ... }
 */
function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * Сохранить объект пользователей
 * @param {Object} users
 */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Зарегистрировать нового пользователя
 * @param {string} username
 * @param {string} password
 * @returns {boolean} true если успешно, false если пользователь уже существует
 */
function addUser(username, password) {
  const users = getUsers();
  if (users[username]) {
    return false;
  }
  users[username] = password;
  saveUsers(users);
  return true;
}

/**
 * Проверить пару логин/пароль
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
function validateUser(username, password) {
  const users = getUsers();
  return users[username] === password;
}

/**
 * Получить имя текущего вошедшего пользователя
 * @returns {string|null}
 */
function getCurrentUser() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

/**
 * Запомнить вошедшего пользователя
 * @param {string} username
 */
function setCurrentUser(username) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

/**
 * Выйти из системы (удалить текущую сессию)
 */
function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Получить массив результатов игр
 * @returns {Array<{username, score, avgReaction, date}>}
 */
function getLeaderboard() {
  const data = localStorage.getItem(LEADERBOARD_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Сохранить весь массив лидеров
 * @param {Array} entries
 */
function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

/**
 * Добавить новый результат в таблицу лидеров.
 * Сортирует по очкам (убывание), затем по среднему времени реакции (возрастание)
 * и оставляет только лучшие 20 записей.
 * @param {{ username: string, score: number, avgReaction: number, date: string }} entry
 * @returns {Array} обновлённый массив (топ-20)
 */
function addLeaderboardEntry(entry) {
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);

  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.avgReaction - b.avgReaction;
  });

  const top20 = leaderboard.slice(0, 20);
  saveLeaderboard(top20);
  return top20;
}