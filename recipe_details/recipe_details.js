const menuButton = document.querySelector('.menu__button')

const elem = document.querySelector('nav')

menuButton.addEventListener('click', () => {
    elem.classList.toggle('show')
})