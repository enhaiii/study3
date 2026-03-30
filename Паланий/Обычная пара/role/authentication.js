let users = JSON.parse(localStorage.getItem("users")) || [];

const adminExists = users.some(user => user.role === 'Admin');
if (!adminExists) {
    users.push({
        name: "admin",
        password: "admin",
        role: "Admin",
        email: "",
        bio: "",
        notes: []
    });
    localStorage.setItem("users", JSON.stringify(users));
}

const nameUser = document.getElementById('inuptLogin');
const passwordUser = document.getElementById('inputPassword');
const buttonRegistration = document.getElementById('registration');
const signLogin = document.getElementById('signLogin');
const signPassword = document.getElementById('signPassword');
const buttonSignIn = document.getElementById('signIn');
const guestLogin = document.getElementById('guestLogin');
const answer = document.getElementById('answer');

buttonRegistration.addEventListener('click', () => {
    const name = nameUser.value.trim();
    const pwd = passwordUser.value.trim();

    if (!name || !pwd) {
        answer.textContent = "Логин и пароль не могут быть пустыми";
        return;
    }

    if (users.some(user => user.name === name)) {
        answer.textContent = "Логин уже занят";
    } else {
        users.push({
            name: name,
            password: pwd,
            role: "User",
            email: "",
            bio: "",
            notes: []
        });
        localStorage.setItem("users", JSON.stringify(users));
        answer.textContent = "Регистрация успешна! Теперь войдите.";
    }

    nameUser.value = "";
    passwordUser.value = "";
});

buttonSignIn.addEventListener('click', () => {
    const login = signLogin.value.trim();
    const pwd = signPassword.value.trim();
    const user = users.find(u => u.name === login && u.password === pwd);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "./profile.html";
    } else {
        answer.textContent = "Неверный логин или пароль";
    }
});

guestLogin.addEventListener('click', () => {
    const guest = {
        name: "Гость_" + Date.now(),
        password: "",
        role: "Guest",
        email: "",
        bio: "",
        notes: []
    };
    localStorage.setItem("currentUser", JSON.stringify(guest));
    window.location.href = "./profile.html";
});