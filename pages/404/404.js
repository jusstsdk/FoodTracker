document.addEventListener("DOMContentLoaded", function() {
    const backButton = document.querySelector("#back-button");
    backButton.addEventListener("click", function() {
        history.back();
    });
});