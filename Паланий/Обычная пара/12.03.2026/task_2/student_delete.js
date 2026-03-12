let students = []

if (JSON.parse(localStorage.getItem("students")) === null){
    students = []
} else {
    students = JSON.parse(localStorage.getItem("students"))
}

const list = document.querySelector('#list')

const filter = document.querySelector('#filter')

const sendButton = document.querySelector('#send')

const search = document.querySelector('#search')

const nameInput = document.querySelector('#name')
const ageInput = document.querySelector('#age')
const groupInput = document.querySelector('#group')

sendButton.addEventListener('click', function() {
    const nameStudent = nameInput.value 
    const ageStudent = ageInput.value 
    const groupStudent = groupInput.value 

    students.push({
        name: nameStudent,
        age: ageStudent,
        group: groupStudent
    })

    renderStudent()
    renderFilter(groupStudent)

    localStorage.setItem('students', JSON.stringify(students))
})

search.addEventListener("input", () => {
    renderStudent()
})

const renderStudent = () => {
    list.innerHTML = ""

    for(let i = 0; i < students.length; i++) {
        if (filter.value !== "all" && students[i].group !== filter.value) {
            continue
        }

        let query = search.value.toLowerCase()

        if (query !== "" && !students[i].name.toLowerCase().includes(query)) {
            continue
        }
        let li = document.createElement('li')
        li.textContent = `Имя: ${students[i].name}, возраст: ${students[i].age}, группа: ${students[i].group}`
                
        let button = document.createElement('button')
        button.textContent = "Удалить студента"

        button.addEventListener('click', function() {
            students.splice(i, 1)
            renderStudent(0)
        })
        li.appendChild(button)
        list.appendChild(li)
        localStorage.setItem('students', JSON.stringify(students))
        }

}



filter.onchange = () => {
    renderStudent()
} 

const renderFilter = (group) => {
    let exist = false 

    for (let i = 0; i < filter.options.length; i++) {
        if (group === filter.options[i].value) {
            exist = true
            break
        }
    }

    if (!exist) {
        let option = document.createElement('option')
        option.value = group
        option.textContent = group

        filter.appendChild(option)
    }

}
renderStudent()