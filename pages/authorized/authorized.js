const header = document.querySelector("header")
fetch('../../components/header/header.html')
    .then(res=>res.text())
    .then(data=>{
        header.innerHTML=data
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'text/html')
        eval(doc.querySelector('script').textContent)
    })

const search = document.querySelectorAll('.meal-wrapper')

search.forEach((element) => {
    const showButton = element.querySelector('button')

    showButton.onclick = () => {
        element.classList.toggle('search')
    }
})

const user = JSON.parse(localStorage.getItem("current_user"))

document.querySelector(".greeting-container h3").innerHTML = `Hi, ${user.username}!`

const today = new Date()
const month = today.toLocaleDateString('en-US', { month: 'long' })
const date = today.toLocaleDateString('en-US', { day: 'numeric' })
document.querySelector(".greeting-container h4").innerHTML = `${month}, ${date}`