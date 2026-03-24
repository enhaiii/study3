let currentUser = JSON.parse(localStorage.getItem("currentUser"))
const userName = document.getElementById('userName')
userName.textContent = currentUser.name