const users = JSON.parse(localStorage.getItem("users"))

document.querySelector(".buttonWrapper button").addEventListener('click', (event) => {
    event.preventDefault()

    const username = document.getElementById("username")
    const password = document.getElementById("password")

    if (username.value === '') {
        username.style.border = "1px solid var(--main-red)"
        return
    }

    if (password.value === '') {
        password.style.border = "1px solid var(--main-red)"
        return
    }

    if (!users) {
        alert('Something went wrong')
        return;
    }

    const result = users.find(user => (user.username === username.value || user.email === username.value) && user.password === password.value)
    console.log(result)

    if (result) {
        localStorage.setItem("current_user", JSON.stringify(result))
        window.location = '../profile/profile.html'
    } else {
        alert('Incorrect username or password')
    }
})
