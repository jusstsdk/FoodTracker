const menuButton = document.querySelector('.menu__button')

const elem = document.querySelector('nav')

menuButton.addEventListener('click', () => {
    elem.classList.toggle('show')
})


const user = JSON.parse(localStorage.getItem("current_user"))

//name + age
if (user.age) {
    document.querySelector(".personalize-user-info p:first-child span").prepend(`${user.username}, ${user.age}`)
} else {
    document.querySelector(".personalize-user-info p:first-child span").prepend(`${user.username}, --`)
}

document.querySelector(".personalize-user-info p:last-child").innerHTML = user.email

//photo
if (user.photo) {
    document.querySelector(".user-info img").src = user.photo
} else {
    document.querySelector(".user-info img").src = "/assets/svg/default-avatar.svg"
}

//stats
if (user.height && user.weight) {
    document.querySelector(".personal-stats p:last-child").innerHTML = `${user.height} cm, ${user.weight} kg`
} else if (user.height && (user.weight === null || user.weight === "")) {
    document.querySelector(".personal-stats p:last-child").innerHTML = `${user.height} cm, -- kg`
} else if ((user.height === null || user.height === "") && user.weight) {
    document.querySelector(".personal-stats p:last-child").innerHTML = `-- cm, ${user.weight} kg`
} else {
    document.querySelector(".personal-stats p:last-child").innerHTML = `-- cm, -- kg`
}

function calculateBMI(height, weight) {
    const bmi = weight / ((height / 100) ** 2)
    return bmi.toFixed(1)
}

bmi = calculateBMI(user.height, user.weight)
if (bmi > 0) {
    document.querySelector(".personal-stats p:first-child").innerHTML = 'BMI: ' + bmi
} else {
    document.querySelector(".personal-stats p:first-child").innerHTML = 'BMI: --'
}

const bmi_arrow = document.createElement("img")
document.querySelector(".personal-stats p:first-child").append(bmi_arrow)

if (bmi >= 18.5 && bmi < 25) {
    bmi_arrow.src = "/assets/svg/green-arrow.svg"
} else if (bmi < 18.5) {
    bmi_arrow.src = "/assets/svg/red-arrow-down.svg"
} else {
    bmi_arrow.src = "/assets/svg/red-arrow-up.svg"
}


const sign_out = document.querySelector(".sign-out a")
sign_out.addEventListener('click', () => {
    event.preventDefault()
    localStorage.removeItem("current_user")
    window.location = '../main_page/main_page.html'
})

const edit_button = document.querySelector(".personalize-user-info button")
edit_button.addEventListener("click", () => {
    const user_info = document.querySelector(".personalize-user-info")
    const personal_stats = document.querySelector(".personal-stats")

    const edit_username = document.getElementById("edit_username")
    const edit_age = document.getElementById("edit_age")
    const edit_height = document.getElementById("edit_height")
    const edit_weight = document.getElementById("edit_weight")


    if (user_info.classList.contains("edit")) {
        const all_users = JSON.parse(localStorage.getItem("users"))

        const isUsernameTaken = all_users.some(user => user.username === edit_username.value)
        if (isUsernameTaken && (user.username !== edit_username.value)) {
            alert("User with the same username already exists")
            return
        }

        user.username = edit_username.value
        user.age = edit_age.value
        user.height = edit_height.value
        user.weight = edit_weight.value

        const current_user = all_users.find(c_user => c_user.email === user.email)
        current_user.username = edit_username.value
        current_user.age = edit_age.value
        current_user.height = edit_height.value
        current_user.weight = edit_weight.value

        localStorage.setItem("users", JSON.stringify(all_users))
        localStorage.setItem("current_user", JSON.stringify(user))

        window.location.reload()
    }

    user_info.classList.toggle("edit")
    personal_stats.classList.toggle("edit")

    edit_username.value = user.username
    edit_age.value = user.age
    edit_height.value = user.height
    edit_weight.value = user.weight
})
