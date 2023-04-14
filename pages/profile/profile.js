const menuButton = document.querySelector('.menu__button')

const elem = document.querySelector('nav')

menuButton.addEventListener('click', () => {
    elem.classList.toggle('show')
})

async function getUsers() {
    const response = await fetch('http://localhost:3000/users', {method: 'GET'});
    return await response.json();
}

async function fetchUsers() {
    try {
        return await getUsers()
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

const user = JSON.parse(localStorage.getItem("current_user"))

if (user.age) {
    document.querySelector(".personalize-user-info p:first-child span").prepend(`${user.username}, ${user.age}`)
} else {
    document.querySelector(".personalize-user-info p:first-child span").prepend(`${user.username}, --`)
}

document.querySelector(".personalize-user-info p:last-child").innerHTML = user.email

if (user.image) {
    document.querySelector(".user-info img").src = user.image
} else {
    document.querySelector(".user-info img").src = "/assets/svg/default-avatar.svg"
}

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
if (bmi > 0 && isFinite(parseFloat(bmi))) {
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

const fileInput = document.getElementById('fileInput');
const fileLabel = document.querySelector('.custom-file-upload');

fileInput.addEventListener('change', function () {
    fileLabel.innerHTML = fileInput.files[0].name;
});

const edit_button = document.querySelector(".personalize-user-info button")
edit_button.addEventListener("click", async () => {
    const user_info = document.querySelector(".personalize-user-info")
    const user_photo = document.querySelector(".user-photo")
    const personal_stats = document.querySelector(".personal-stats")
    const file_upload = document.querySelector(".custom-file-upload")

    const edit_username = document.getElementById("edit_username")
    const edit_age = document.getElementById("edit_age")
    const edit_height = document.getElementById("edit_height")
    const edit_weight = document.getElementById("edit_weight")


    if (user_info.classList.contains("edit")) {
        if (user.username === edit_username.value &&
            user.age === edit_age.value &&
            user.height === edit_height.value &&
            user.weight === edit_weight.value) {
            user_info.classList.toggle("edit")
            user_photo.classList.toggle("edit")
            personal_stats.classList.toggle("edit")
            file_upload.classList.toggle("edit")
            return
        }

        const isUsernameTaken = await checkUsername(edit_username.value)
        if (isUsernameTaken && (user.username !== edit_username.value)) {
            alert("User with the same username already exists")
            return
        }

        const userToUpdate = {
            id: user.id,
            username: edit_username.value,
            age: parseInt(edit_age.value),
            height: parseInt(edit_height.value),
            weight: parseFloat(edit_weight.value)
        }

        fetch('http://localhost:3000/users/' + user.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userToUpdate)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Updated user:', data);
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });

        user.username = edit_username.value
        user.age = edit_age.value
        user.height = edit_height.value
        user.weight = edit_weight.value

        localStorage.setItem("current_user", JSON.stringify(user))
        window.location.reload()
    }

    user_info.classList.toggle("edit")
    user_photo.classList.toggle("edit")
    personal_stats.classList.toggle("edit")
    file_upload.classList.toggle("edit")

    edit_username.value = user.username
    edit_age.value = user.age
    edit_height.value = user.height
    edit_weight.value = user.weight
})
