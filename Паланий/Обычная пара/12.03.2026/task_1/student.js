let students = []

const list = document.querySelector('#list')

const filter = document.querySelector('#filter')

const sendButton = document.querySelector('#send')

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
})

const renderStudent = () => {
    list.innerHTML = ""

    if (filter.value !== "all") {
        for(let i = 0; i < students.length; i++) {
            if (students[i].group === filter.value) {
                let li = document.createElement('li')
                li.textContent = `Имя: ${students[i].name}, возраст: ${students[i].age}, группа: ${students[i].group}`
                list.appendChild(li)
            }
        } 
    } else {
        for(let i = 0; i < students.length; i++) {
            let li = document.createElement('li')
            li.textContent = `Имя: ${students[i].name}, возраст: ${students[i].age}, группа: ${students[i].group}`
            list.appendChild(li)
        }
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