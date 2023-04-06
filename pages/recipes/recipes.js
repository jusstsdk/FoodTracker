const header = document.querySelector("header")
fetch('../../components/header/header.html')
    .then(res=>res.text())
    .then(data=>{
        header.innerHTML=data
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'text/html')
        eval(doc.querySelector('script').textContent)
    })

const recipe1 = {
    name: "Classic Shrimp Salad",
    calories: 111,
    text: "A salad with shrimp is a light and refreshing dish that combines the sweet, succulent flavor of shrimp with crisp, crunchy vegetables and a tangy dressing. \n" +
        "This salad is perfect for warm weather days or as" +
        "a healthy and satisfying lunch or dinner option.<br>" +
        "<br>" +
        "Ingredients:<br>" +
        "1 lb of shrimp, peeled and deveined<br>" +
        "1 head of lettuce, washed and torn into bite-sized pieces<br>" +
        "1/2 cup of cherry tomatoes, halved<br>" +
        "1/2 cup of sliced cucumbers<br>" +
        "1/4 cup of diced red onion<br>" +
        "1 avocado, diced<br>" +
        "1/4 cup of chopped fresh cilantro<br>" +
        "Salt and pepper to taste",
    image: "https://res.cloudinary.com/dg2oekd3o/image/upload/v1679951461/FoodTracker/salad1_wo7ies.svg"
}

const recipe2 = {
    name: "Classic Shrimp Salad",
    calories: 222,
    text: "A salad with shrimp is a light and refreshing dish that combines the sweet, succulent flavor of shrimp with crisp, crunchy vegetables and a tangy dressing. \n" +
        "This salad is perfect for warm weather days or as" +
        "a healthy and satisfying lunch or dinner option.<br>" +
        "<br>" +
        "Ingredients:<br>" +
        "1 lb of shrimp, peeled and deveined<br>" +
        "1 head of lettuce, washed and torn into bite-sized pieces<br>" +
        "1/2 cup of cherry tomatoes, halved<br>" +
        "1/2 cup of sliced cucumbers<br>" +
        "1/4 cup of diced red onion<br>" +
        "1 avocado, diced<br>" +
        "1/4 cup of chopped fresh cilantro<br>" +
        "Salt and pepper to taste",
    image: "https://res.cloudinary.com/dg2oekd3o/image/upload/v1679951461/FoodTracker/salad1_wo7ies.svg"
}

const recipe3 = {
    name: "Classic Shrimp Salad",
    calories: 333,
    text: "A salad with shrimp is a light and refreshing dish that combines the sweet, succulent flavor of shrimp with crisp, crunchy vegetables and a tangy dressing. \n" +
        "This salad is perfect for warm weather days or as" +
        "a healthy and satisfying lunch or dinner option.<br>" +
        "<br>" +
        "Ingredients:<br>" +
        "1 lb of shrimp, peeled and deveined<br>" +
        "1 head of lettuce, washed and torn into bite-sized pieces<br>" +
        "1/2 cup of cherry tomatoes, halved<br>" +
        "1/2 cup of sliced cucumbers<br>" +
        "1/4 cup of diced red onion<br>" +
        "1 avocado, diced<br>" +
        "1/4 cup of chopped fresh cilantro<br>" +
        "Salt and pepper to taste",
    image: "https://res.cloudinary.com/dg2oekd3o/image/upload/v1679951461/FoodTracker/salad1_wo7ies.svg"
}

const recipe4 = {
    name: "Classic Shrimp Salad",
    calories: 365,
    text: "A salad with shrimp is a light and refreshing dish that combines the sweet, succulent flavor of shrimp with crisp, crunchy vegetables and a tangy dressing. \n" +
        "This salad is perfect for warm weather days or as" +
        "a healthy and satisfying lunch or dinner option.<br>" +
        "<br>" +
        "Ingredients:<br>" +
        "1 lb of shrimp, peeled and deveined<br>" +
        "1 head of lettuce, washed and torn into bite-sized pieces<br>" +
        "1/2 cup of cherry tomatoes, halved<br>" +
        "1/2 cup of sliced cucumbers<br>" +
        "1/4 cup of diced red onion<br>" +
        "1 avocado, diced<br>" +
        "1/4 cup of chopped fresh cilantro<br>" +
        "Salt and pepper to taste",
    image: "https://res.cloudinary.com/dg2oekd3o/image/upload/v1679951461/FoodTracker/salad1_wo7ies.svg"
}

const recipe5 = {
    name: "Classic Shrimp Salad",
    calories: 555,
    text: "A salad with shrimp is a light and refreshing dish that combines the sweet, succulent flavor of shrimp with crisp, crunchy vegetables and a tangy dressing. \n" +
        "This salad is perfect for warm weather days or as" +
        "a healthy and satisfying lunch or dinner option.<br>" +
        "<br>" +
        "Ingredients:<br>" +
        "1 lb of shrimp, peeled and deveined<br>" +
        "1 head of lettuce, washed and torn into bite-sized pieces<br>" +
        "1/2 cup of cherry tomatoes, halved<br>" +
        "1/2 cup of sliced cucumbers<br>" +
        "1/4 cup of diced red onion<br>" +
        "1 avocado, diced<br>" +
        "1/4 cup of chopped fresh cilantro<br>" +
        "Salt and pepper to taste",
    image: "https://res.cloudinary.com/dg2oekd3o/image/upload/v1679951461/FoodTracker/salad1_wo7ies.svg"
}

const recipe6 = {
    name: "Classic Shrimp Salad",
    calories: 666,
    text: "A salad with shrimp is a light and refreshing dish that combines the sweet, succulent flavor of shrimp with crisp, crunchy vegetables and a tangy dressing. \n" +
        "This salad is perfect for warm weather days or as" +
        "a healthy and satisfying lunch or dinner option.<br>" +
        "<br>" +
        "Ingredients:<br>" +
        "1 lb of shrimp, peeled and deveined<br>" +
        "1 head of lettuce, washed and torn into bite-sized pieces<br>" +
        "1/2 cup of cherry tomatoes, halved<br>" +
        "1/2 cup of sliced cucumbers<br>" +
        "1/4 cup of diced red onion<br>" +
        "1 avocado, diced<br>" +
        "1/4 cup of chopped fresh cilantro<br>" +
        "Salt and pepper to taste",
    image: "https://res.cloudinary.com/dg2oekd3o/image/upload/v1679951461/FoodTracker/salad1_wo7ies.svg"
}


const recipes = [recipe1, recipe2, recipe3, recipe4, recipe5, recipe6]

container = document.querySelector(".recipes-container")

function createRecipeInfo(recipe) {

    const recipe_info = document.createElement("div");
    recipe_info.classList.add("recipe-info");

    const image_container = document.createElement("div")
    const image = document.createElement("img");
    image.src = recipe.image;
    image_container.appendChild(image)

    const title = document.createElement("a");
    title.innerHTML = recipe.name;

    const calories = document.createElement("p");
    calories.innerHTML = `${recipe.calories} kcal`;

    recipe_info.append(image_container, title, calories);

    recipe_info.addEventListener("click", () => {
        localStorage.setItem("recipe", JSON.stringify(recipe))
        window.location = "../recipe_details/recipe_details.html"
    })
    return recipe_info;
}

// recipes.map(recipe => {
//     container.appendChild(createRecipeInfo(recipe))
// })

fetch('http://localhost:3000/recipes')
    .then(response => response.json())
    .then(data => {
        data.forEach(recipe => {
            container.appendChild(createRecipeInfo(recipe))
        });
    })
    .catch(error => console.error(error));