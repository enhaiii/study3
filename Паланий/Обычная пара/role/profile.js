let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "./authentication.html";
}

const userNameSpan = document.getElementById('userName');
const userRoleSpan = document.getElementById('userRole');
const emailInput = document.getElementById('Email');
const bioInput = document.getElementById('bio');
const logoutBtn = document.getElementById('logout');
const savedEmailBtn = document.getElementById('savedEmail');
const savedBioBtn = document.getElementById('savedBio');
const noteInput = document.getElementById('note');
const sendButton = document.getElementById('sendButton');
const list = document.getElementById('list');

userNameSpan.textContent = currentUser.name;
userRoleSpan.textContent = currentUser.role;

emailInput.value = currentUser.email || "";
bioInput.value = currentUser.bio || "";
let notes = currentUser.notes || [];

if (currentUser.role === 'Guest') {
    emailInput.disabled = true;
    bioInput.disabled = true;
    noteInput.disabled = true;
    savedEmailBtn.disabled = true;
    savedBioBtn.disabled = true;
    sendButton.disabled = true;
    savedEmailBtn.title = "Гостям недоступно";
    savedBioBtn.title = "Гостям недоступно";
    sendButton.title = "Гостям недоступно";
}

function updateCurrentUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const index = users.findIndex(u => u.name === updatedUser.name);
    if (index !== -1) users[index] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    currentUser = updatedUser;
}

savedEmailBtn.addEventListener('click', () => {
    if (currentUser.role === 'Guest') {
        alert("Гость не может изменять информацию о себе.");
        return;
    }
    currentUser.email = emailInput.value.trim();
    updateCurrentUser(currentUser);
    alert("Email сохранён!");
});

savedBioBtn.addEventListener('click', () => {
    if (currentUser.role === 'Guest') {
        alert("Гость не может изменять информацию о себе.");
        return;
    }
    currentUser.bio = bioInput.value.trim();
    updateCurrentUser(currentUser);
    alert("Информация сохранена!");
});

sendButton.addEventListener('click', () => {
    if (currentUser.role === 'Guest') {
        alert("Гость не может добавлять заметки.");
        return;
    }
    const text = noteInput.value.trim();
    if (!text) {
        alert("Заметка не может быть пустой.");
        return;
    }
    notes.push(text);
    currentUser.notes = notes;
    updateCurrentUser(currentUser);
    renderNotes();
    noteInput.value = "";
});

function renderNotes() {
    list.innerHTML = "";
    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        list.appendChild(li);
    });
}
renderNotes();

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("currentUser");
    window.location.href = "./authentication.html";
});