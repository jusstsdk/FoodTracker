function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'foodtracker_gbcn0m1a');
    formData.append('cloud_name', 'dg2oekd3o');

    fetch('https://api.cloudinary.com/v1_1/dg2oekd3o/image/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const imageUrl = data.url;

            user.image = imageUrl
            localStorage.setItem("current_user", JSON.stringify(user))

            fetch(`http://localhost:3000/users/${user.id}/image`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user.id,
                    image: imageUrl
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch(error => console.error(error))

        })
        .catch(error => console.error(error))
}

const uploadButton = document.querySelector(".user-photo button")
uploadButton.addEventListener("click", () => {
    if (uploadButton.innerHTML === 'Upload') {
        uploadButton.innerHTML = 'Uploaded'
        uploadButton.disabled = true
        uploadButton.style.backgroundColor = "#E7B670"
    }
})
