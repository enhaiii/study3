let users

if (JSON.parse(localStorage.getItem("users")) === null){
    users = []
} else {
    users = JSON.parse(localStorage.getItem("users"))
}

const nameUser = document.getElementById('inuptLogin')
const passwordUser = document.getElementById('inputPassword')
const buttonRegistration = document.getElementById('registration')
const signLogin = document.getElementById('signLogin')
const signPassword = document.getElementById('signPassword')
const buttonSignIn = document.getElementById('signIn')
let inputAnswer = document.getElementById('answer')

buttonRegistration.addEventListener('click', function (){
    let nameValue = nameUser.value 
    let passwordValue = passwordUser.value 

    let isValid = true
    for (let i = 0; i < users.length; i++) {
        if (users[i] === null || users[i].nameUser === nameValue) {
            isValid = false
        }
    }

    if (isValid) {
        let user = {
            "name": nameValue,
            "password": passwordValue
        }

        users.push(user)
        localStorage.setItem('users', JSON.stringify(users))
    } else {
        inputAnswer.textContent = "Логин уже занят"
    }
    
    nameUser.value = ""
    passwordUser.value = ""

})

buttonSignIn.addEventListener('click', function(){
    let loginValue = signLogin.value 
    let passwordValue = signPassword.value 

    for (let i = 0; i < users.length; i++){
        if(users[i].name === loginValue && users[i].password === passwordValue) {
            localStorage.setItem("currentUser", JSON.stringify(users[i]))

            window.location.href = "./hello.html"
        } else {
            inputAnswer.textContent = "Неверный логин или пароль"
        }
    }
})