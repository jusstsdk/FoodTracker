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

async function checkEmail(email) {
    try {
        const users = await fetchUsers();
        return users.find(user => user.email === email)
    } catch (error) {
        console.error(error);
    }
}

async function checkUsername(username) {
    try {
        const users = await fetchUsers();
        return users.find(user => user.username === username)
    } catch (error) {
        console.error(error);
    }
}

async function validateForm() {
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

    const isEmailTaken = await checkEmail(email)
    if (isEmailTaken) {
        alert("User with the same email already exists")
        return false
    }

    const isUsernameTaken = await checkUsername(username)
    if (isUsernameTaken) {
        alert("User with the same username already exists")
        return false
    }

    user = {username: username, email: email, password: password, age: null, bmi: null, height: null, image: null}

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });

    localStorage.setItem("current_user", JSON.stringify(user))
    window.location = '../profile/profile.html'
}
