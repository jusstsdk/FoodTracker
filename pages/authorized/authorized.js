const header = document.querySelector("header")
fetch('../../components/header/header.html')
    .then(res => res.text())
    .then(data => {
        header.innerHTML = data
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'text/html')
        eval(doc.querySelector('script').textContent)
    })

const search = document.querySelectorAll('.meal-wrapper:not(.water-wrapper)')
console.log(search)

search.forEach((element) => {
    const showButton = element.querySelector('button')

    showButton.onclick = () => {
        element.classList.toggle('search')
    }

    const search_result = element.querySelector(".search-result")
    const search_input = element.querySelector(".food-searcher__input input")
    search_input.addEventListener("input", () => {
        search_result.innerHTML = ""

        if (search_input.value === " " || search_input.value === "") {
            search_result.innerHTML = ""
        }

        fetch('http://localhost:3000/foodlist')
            .then(response => response.json())
            .then(data => {
                const result = data.filter(food => food.name.toLowerCase().includes(search_input.value))
                result.forEach(res => {
                    search_result.appendChild(createSearchResult(res, element.id))
                })
            })
            .catch(error => console.error(error));
    })
})

function createSearchResult(food, index) {
    const result_wrapper = document.createElement("div")

    const result_name = document.createElement("p")
    result_name.innerHTML = food.name
    const result_calories = document.createElement("span")
    result_calories.innerHTML = `${food.calories} kcal`

    const add_button = document.createElement("button")
    const add_icon = document.createElement("img")
    add_icon.src = "/assets/svg/brown_plusbutton.svg"
    add_button.appendChild(add_icon)

    add_button.addEventListener("click", () => {
        const food_to_add = {user: user.id, meal: parseInt(index), food: food.id}
        fetch('http://localhost:3000/meals_history/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(food_to_add)
        })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
        window.location.reload()
    })

    result_wrapper.append(result_name, result_calories, add_button)
    return result_wrapper
}

const user = JSON.parse(localStorage.getItem("current_user"))

document.querySelector(".greeting-container h3").innerHTML = `Hi, ${user.username}!`

const today = new Date()
const month = today.toLocaleDateString('en-US', {month: 'long'})
const date = today.toLocaleDateString('en-US', {day: 'numeric'})
document.querySelector(".greeting-container h4").innerHTML = `${month}, ${date}`

const edit_weight = document.querySelector(".weight-wrapper input")
edit_weight.addEventListener("keyup", function (event) {
    if (event.key === 'Enter' && edit_weight.value) {
        fetch(`http://localhost:3000/users/${user.id}/weight`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.id,
                weight: edit_weight.value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error(error))
        user.weight = edit_weight.value
        localStorage.setItem("current_user", JSON.stringify(user))
        alert('Weight has been updated');
    }
})

fetch('http://localhost:3000/meals/user/' + user.id)
    .then(response => response.json())
    .then(data => {
        let calories = 0
        data.forEach(meal => {
            createMealContainer(meal)
            calories += parseInt(meal.calories)
        })
        document.querySelector(".summary > div > p:first-child").innerHTML = `${calories} kcal`
    })
    .catch(error => console.error(error));

function createMealContainer(meal) {
    const meal_wrapper = document.getElementById(meal.meal_id)
    const food_wrapper = document.createElement("div")
    food_wrapper.classList.add("food-list")

    const name = document.createElement("p")
    name.innerHTML = meal.name
    const calories = document.createElement("span")
    calories.innerHTML = `${meal.calories} kcal`
    const details = document.createElement("dd")
    details.append(name, calories)
    food_wrapper.appendChild(details)

    meal_wrapper.appendChild(food_wrapper)
}

fetch('http://localhost:3000/water/user/' + user.id)
    .then(response => response.json())
    .then(data => {
        let value = 0
        data.forEach(water => {
            createWaterContainer(water.value)
            value += parseInt(water.value)
        })
        document.querySelector(".summary > div > p:last-child").innerHTML = `${value} ml`
    })
    .catch(error => console.error(error));

function createWaterContainer(water) {
    const water_wrapper = document.getElementById("4")
    const total_wrapper = document.createElement("div")
    total_wrapper.classList.add("food-list")

    const name = document.createElement("p")
    name.innerHTML = `${water} ml`
    const details = document.createElement("dd")
    details.append(name)
    total_wrapper.appendChild(details)

    water_wrapper.appendChild(total_wrapper)
}

const water_wrapper = document.querySelector(".water-wrapper")
const showButton = water_wrapper.querySelector('button')
showButton.onclick = () => {
    water_wrapper.classList.toggle('search')
}

const water_input = water_wrapper.querySelector("input")
water_input.addEventListener("keyup", function (event) {
    if (event.key === 'Enter' && water_input.value) {
        fetch(`http://localhost:3000/water_history/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user.id,
                value: water_input.value
            })
        })
            .catch(error => console.error(error))
        window.location.reload()
    }
})