const menuButton = document.querySelector('.menu__button')

const elem = document.querySelector('nav')

menuButton.addEventListener('click', () => {
    elem.classList.toggle('show')
})

const search = document.querySelectorAll('.meal-wrapper')

search.forEach((element) => {
    const showButton = element.querySelector('button')

    showButton.onclick = () =>{
        element.classList.toggle('search')
    }
})