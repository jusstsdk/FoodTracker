const header = document.querySelector("header")
fetch('../../components/header/header.html')
    .then(res => res.text())
    .then(data => {
        header.innerHTML = data
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'text/html')
        eval(doc.querySelector('script').textContent)
    })

const user = JSON.parse(localStorage.getItem("current_user"))
container = document.querySelector(".recipes-container")

function createRecipeInfo(recipe) {
    const recipe_info = document.createElement("div");
    recipe_info.classList.add("recipe-info");

    const image_container = document.createElement("div")
    image_container.classList.add("recipe-image")
    const image = document.createElement("img");
    image.src = recipe.image;
    image_container.appendChild(image)

    const title = document.createElement("a");
    title.innerHTML = recipe.name;

    const calories = document.createElement("p");
    calories.innerHTML = `${recipe.calories} kcal`;

    const recipe_title = document.createElement("div");
    recipe_title.classList.add("recipe-title");
    recipe_title.append(title, calories)

    const recipe_main = document.createElement("div");
    recipe_main.classList.add("recipe-main");
    recipe_main.append(recipe_title)

    const like = document.createElement("img")

    fetch('http://localhost:3000/favorites/' + user.id)
        .then(response => response.json())
        .then(data => {
            if (data.find(tmp => tmp.recipe_id === recipe.id)) {
                like.src = "/assets/svg/colored-heart.svg"
                like.addEventListener("mouseover", function () {
                    this.src = "/assets/svg/uncolored-heart.svg";
                });
                like.addEventListener("mouseout", function () {
                    this.src = "/assets/svg/colored-heart.svg";
                });
                like.addEventListener("click", (event) => {
                    event.stopPropagation()
                    fetch('http://localhost:3000/favorites', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({user_id: user.id, recipe_id: recipe.id})
                    })
                    window.location.reload()
                })
            } else {
                like.src = "/assets/svg/uncolored-heart.svg"
                like.addEventListener("mouseover", function () {
                    this.src = "/assets/svg/colored-heart.svg";
                });
                like.addEventListener("mouseout", function () {
                    this.src = "/assets/svg/uncolored-heart.svg";
                });
                like.addEventListener("click", (event) => {
                    event.stopPropagation()
                    fetch('http://localhost:3000/favorites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({user_id: user.id, recipe_id: recipe.id})
                    })
                    window.location.reload()
                })
            }
        })
        .catch(error => console.error(error));

    recipe_main.appendChild(like)
    recipe_info.append(image_container, recipe_main);

    recipe_info.addEventListener("click", () => {
        localStorage.setItem("recipe", JSON.stringify(recipe))
        window.location = "../recipe_details/recipe_details.html"
    })
    return recipe_info;
}

const dropdown = document.getElementById('categories')
fetch('http://localhost:3000/categories')
    .then(response => response.json())
    .then(data => {
        let option = document.createElement("option")
        option.text = "All"
        option.value = '0'
        dropdown.appendChild(option)
        data.forEach(category => {
            let tmp = document.createElement("option")
            tmp.text = category.name
            tmp.value = category.id
            dropdown.appendChild(tmp)
        });
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD && localStorage.getItem("selected_category")) {
            dropdown.value = localStorage.getItem("selected_category")
        }
    })
    .catch(error => console.error(error));

function filterRecipesByCategory(category) {
    container.innerHTML = ''
    if (category === '0') {
        fetch('http://localhost:3000/recipes')
            .then(response => response.json())
            .then(data => {
                data.forEach(recipe => {
                    container.appendChild(createRecipeInfo(recipe))
                });
                console.log(data)
            })
            .catch(error => console.error(error));
    } else {
        fetch('http://localhost:3000/recipes/category/' + category)
            .then(response => response.json())
            .then(data => {
                data.forEach(recipe => {
                    container.appendChild(createRecipeInfo(recipe))
                });
            })
            .catch(error => console.error(error));
    }
}

dropdown.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;
    localStorage.setItem("selected_category", selectedCategory)
    filterRecipesByCategory(selectedCategory);
});

if (performance.navigation.type === performance.navigation.TYPE_RELOAD && localStorage.getItem("selected_category")) {
    filterRecipesByCategory(localStorage.getItem("selected_category"));
}
else {
    localStorage.setItem("selected_category", '0')
    filterRecipesByCategory('0');
}
