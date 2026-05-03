(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const authScreen = document.getElementById('auth-screen');
    const mainScreen = document.getElementById('main-screen');

    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const regUsername = document.getElementById('reg-username');
    const regPassword = document.getElementById('reg-password');
    const regConfirm = document.getElementById('reg-confirm');

    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    const currentUserDisplay = document.getElementById('current-user-display');
    const logoutBtn = document.getElementById('logout-btn');

    let authMode = 'login';

    function showAuthScreen() {
      if (authScreen) authScreen.classList.add('active');
      if (mainScreen) mainScreen.classList.remove('active');
    }

    function showMainScreen(username) {
      if (authScreen) authScreen.classList.remove('active');
      if (mainScreen) mainScreen.classList.add('active');
      if (currentUserDisplay) currentUserDisplay.textContent = username;
    }

    function setAuthMode(mode) {
      authMode = mode;
      if (mode === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        if (loginError) loginError.textContent = '';
        if (registerError) registerError.textContent = '';
      } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        if (loginError) loginError.textContent = '';
        if (registerError) registerError.textContent = '';
      }
    }

    if (tabLogin) {
      tabLogin.addEventListener('click', () => setAuthMode('login'));
    }
    if (tabRegister) {
      tabRegister.addEventListener('click', () => setAuthMode('register'));
    }

    function isValidUsername(str) {
      return /^[a-zA-Z0-9_]{3,20}$/.test(str);
    }

    function isValidPassword(str) {
      return str.length >= 3 && str.length <= 30;
    }

    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (loginError) loginError.textContent = '';

        const username = loginUsername.value.trim();
        const password = loginPassword.value;

        if (!username || !password) {
          if (loginError) loginError.textContent = 'Заполните все поля';
          return;
        }

        if (!validateUser(username, password)) {
          if (loginError) loginError.textContent = 'Неверный логин или пароль';
          return;
        }

        setCurrentUser(username);
        loginUsername.value = '';
        loginPassword.value = '';
        showMainScreen(username);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (registerError) registerError.textContent = '';

        const username = regUsername.value.trim();
        const password = regPassword.value;
        const confirm = regConfirm.value;

        if (!username || !password || !confirm) {
          if (registerError) registerError.textContent = 'Заполните все поля';
          return;
        }

        if (!isValidUsername(username)) {
          if (registerError) registerError.textContent = 'Логин: 3-20 символов (буквы, цифры, _)';
          return;
        }

        if (!isValidPassword(password)) {
          if (registerError) registerError.textContent = 'Пароль: от 3 до 30 символов';
          return;
        }

        if (password !== confirm) {
          if (registerError) registerError.textContent = 'Пароли не совпадают';
          return;
        }

        const success = addUser(username, password);
        if (!success) {
          if (registerError) registerError.textContent = 'Пользователь уже существует';
          return;
        }

        setCurrentUser(username);
        regUsername.value = '';
        regPassword.value = '';
        regConfirm.value = '';
        showMainScreen(username);
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearCurrentUser();
        if (window.gameAPI && typeof window.gameAPI.resetGame === 'function') {
          window.gameAPI.resetGame();
        }
        if (currentUserDisplay) currentUserDisplay.textContent = '';
        showAuthScreen();
        setAuthMode('login');
      });
    }

    const savedUser = getCurrentUser();
    if (savedUser) {
      showMainScreen(savedUser);
    } else {
      showAuthScreen();
    }
  });
})();