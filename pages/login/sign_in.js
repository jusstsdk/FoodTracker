const users = JSON.parse(localStorage.getItem("users"))

async function getUsers() {
    const response = await fetch('http://localhost:3000/users', { method: 'GET' });
    return await response.json();
}
async function fetchUsers() {
    try {
        return await getUsers()
    } catch (error) {
        console.error(error);
    }
}

async function findUser(username, password) {
    try {
        const users = await fetchUsers();
        return users.find(user => (user.username === username || user.email === username) && user.password === password)
    } catch (error) {
        console.error(error);
    }
}

document.querySelector(".buttonWrapper button").addEventListener('click', async (event) => {
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

    const result = await findUser(username.value, password.value)
    if (result) {
        localStorage.setItem("current_user", JSON.stringify(result))
        window.location = '../profile/profile.html'
    } else {
        alert('Incorrect username or password')
    }
})
