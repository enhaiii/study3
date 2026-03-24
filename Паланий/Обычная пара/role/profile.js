let currentUser = JSON.parse(localStorage.getItem("currentUser"))

if (JSON.parse(localStorage.getItem("currentUser")) === null){
    currentUser = []
} else {
    currentUser = JSON.parse(localStorage.getItem("currentUser"))
}

const userName = document.getElementById('userName')
const email = document.getElementById('Email')
const bio = document.getElementById('bio')
const logout = document.getElementById('logout')
const savedEmail = document.getElementById('savedEmail')
const savedBio = document.getElementById('savedBio')
userName.textContent = currentUser.name
let notesAll = []


function saveText() {
    const saved = localStorage.getItem('userText')
    if (saved) {
        savedEmail.textContent = saved
    }
}
// email.addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         const text = this.value

//     }
// })

if (JSON.parse(localStorage.getItem("notes")) === null){
    notes = []
} else {
    notes = JSON.parse(localStorage.getItem("notes"))
}

const list = document.querySelector('#list')
const sendButton = document.querySelector('#sendButton')
const note = document.querySelector('#note')

sendButton.addEventListener('click', function() {
    const fillNote = note.value 

    notesAll.push({
        note: fillNote
    })

    renderNotes()

    localStorage.setItem('notesAll', JSON.stringify(notesAll))
})

logout.addEventListener('click', function() {
    localStorage.removeItem('token')
    localStorage.removeItem('notesAll')
    localStorage.removeItem('email')
    localStorage.removeItem('bio')

    window.location.href = "./authentication.html"
})

const renderNotes = () => {
    list.innerHTML = ""

    for(let i = 0; i < notesAll.length; i++) {
        let li = document.createElement('li')
        li.textContent = `Заметка: ${notesAll[i].note}`
        list.appendChild(li)
        localStorage.setItem('notesAll', JSON.stringify(notesAll))
    }
}