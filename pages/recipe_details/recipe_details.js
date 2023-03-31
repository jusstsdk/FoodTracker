const header = document.querySelector("header")
fetch('../../components/header/header.html')
    .then(res=>res.text())
    .then(data=>{
        header.innerHTML=data
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, 'text/html')
        eval(doc.querySelector('script').textContent)
    })

const recipe = JSON.parse(localStorage.getItem("recipe"))

console.log(recipe)

document.querySelector(".name-container h1").innerHTML = recipe.name
document.querySelector(".name-container h3").innerHTML = recipe.calories + " kcal"
document.querySelector(".recipe__text p").innerHTML = recipe.text
document.querySelector(".recipe-container img").src = recipe.image