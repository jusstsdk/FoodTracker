let users = JSON.parse(localStorage.getItem("users"))

function validateForm() {
    event.preventDefault()

    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirm_password = document.getElementById("confirm_password").value

    const passwordRegex = /^[a-zA-Z0-9]+$/;
    if (!passwordRegex.test(password)) {
        alert("Password must contain only letters and numbers");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Incorrect email address")
        return false
    }

    if (password !== confirm_password) {
        alert("Password mismatch")
        return false;
    }

    if (users) {
        const result = users.find(user => user.email === email)
        if (result) {
            alert("User with the same email already exists")
            return false
        }
    }

    const isUsernameTaken = users.some(user => user.username === username)
    if (isUsernameTaken) {
        alert("User with the same username already exists")
        return false
    }

    user = { username: username, email: email, password: password, age: null, height: null, weight: null, photo: null }

    if (users) {
        users.push(user)
    }
    else {
        users = [user]
    }
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("current_user", JSON.stringify(user))
    window.location = '../profile/profile.html'
}
