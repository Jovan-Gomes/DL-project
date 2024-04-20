const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const img2 = document.querySelector('#img2');
const img3 = document.querySelector('#img3');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const keywor = document.querySelector('#predictions');
const imgContainer1 = document.getElementById('img-container1');
const imgContainer2 = document.getElementById('img-container2');
const imgContainer3 = document.getElementById('img-container3');
const imgContainer4 = document.getElementById('img-container4');
const vButton = document.getElementById('virtualM');
const backButton = document.getElementById('back-button');
const formel = document.getElementById('form');
const sub = document.getElementById('sub');
const fname = document.getElementById('fname');
const outpath = document.getElementById('outpath');
const logo = document.getElementById('logo');
const selectedImage = document.getElementById('selected-image');

function loadImage(e) {
    const file = e.target.files[0];

    if(!isFileImage(file)) {
        alertError('Please select an image');
        return;
    }

    //Get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);

    form.style.display = 'block';
    filename.innerText = file.name;
    outputPath.innerText = file.path;
}

// send image data to main
function sendImage(e) {
    e.preventDefault();

    //console.log(e.target.id);

    if (currentImageElementId === 'img') {
        const imgPath = img.files[0].path;
        if(!img.files[0]) {
            alertError('Please upload an image');
            return;
        }

        const loadingSpinner = document.getElementById('loading-overlay');
        loadingSpinner.style.display = 'flex';

        // If element with id "img" called the form element
        ipcRenderer.send('image:poem', imgPath);

    } else if (currentImageElementId === 'img2') {
        const imgPath = img2.files[0].path;
        if(!img2.files[0]) {
            alertError('Please upload an image');
            return;
        }

        const loadingSpinner = document.getElementById('loading-overlay');
        loadingSpinner.style.display = 'flex';

        // If element with id "img2" called the form element
        ipcRenderer.send('image:story', imgPath);

    } else if (currentImageElementId === 'img3') {
        const imgPath = img3.files[0].path;
        if(!img3.files[0]) {
            alertError('Please upload an image');
            return;
        }

        const loadingSpinner = document.getElementById('loading-overlay');
        loadingSpinner.style.display = 'flex';

        // If element with id "img3" called the form element
        ipcRenderer.send('OCR:image', imgPath);
    }
}


// Catch the image:done event
ipcRenderer.on('image:done', ( data ) => {
    if (data) {

        const loadingSpinner = document.getElementById('loading-overlay');
        loadingSpinner.style.display = 'none';

        console.log(`Received data from main process: ${data}`);

        // Check if the data contains 'Top 5 Predictions:'
        if (data.includes('Top 5 Predictions:')) {
            // Split the data by new line characters to get an array of lines
            const lines = data.split('\n');

            const htmlString = lines.slice(21).join('\n');
            const predictions = htmlString.replace(/<[^>]+>/g, '');

            console.log(`Predictions: ${predictions}`);

            // Update the UI with the predictions data
            form.style.display = 'block';
            keywor.innerText = predictions;
        } else if (data.includes('Predicted Emotion:')){
            
            console.log(`Predictions: ${data}`);

            // Update the UI with the predictions data
            const predictions = data.replace(/<[^>]+>/g, '');
            form.style.display = 'block';
            keywor.innerText = predictions;

            const emotions = ['sadness', 'joy', 'love', 'anger', 'fear', 'surprise'];
            emotions.forEach(emotion => {
                const gif = document.getElementById(`gif-${emotion}`);
                gif.style.display = 'none';
            });

            // Show the corresponding GIF image based on the predicted emotion
            const emotion = predictions.split(':')[1].trim();
            const gifToShow = document.getElementById(`gif-${emotion}`);
            gifToShow.style.display = 'block';

            // Hide the GIF image after 5 seconds
            setTimeout(() => {
                gifToShow.style.display = 'none';
            }, 8000);
        } else {
            console.error('Data format error: No "Top 5 Predictions:" found');
        }
    } else {
        console.error('No data received');
    }
});

//make sure file is image
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];
    return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center',
        }
    });
}

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center',
        }
    });
}

let currentImageElementId;

img.addEventListener('change', (e) => {
    // Hide initial img element
    imgContainer1.classList.add('hidden');
    imgContainer2.classList.add('hidden');
    imgContainer3.classList.add('hidden');
    imgContainer4.classList.add('hidden');
    logo.classList.add('hidden');
    // Show form
    form.classList.remove('hidden');
    backButton.classList.remove('hidden');
    formel.classList.remove('hidden');
    loadImage(e);
    currentImageElementId = 'img';
    if (e.target.files.length > 0) {
        // Get the selected file
        const selectedFile = e.target.files[0];

        // Create a FileReader object to read the selected file
        const reader = new FileReader();

        // Set up the FileReader to load the selected file as a data URL
        reader.readAsDataURL(selectedFile);

        // When the FileReader has loaded the file, update the src attribute of the image tag
        reader.onload = function(e) {
            selectedImage.src = e.target.result;
            selectedImage.style.display = 'block'; // Show the image
        };
    }

});

img2.addEventListener('change', (e) => {
    // Hide initial img element
    imgContainer1.classList.add('hidden');
    imgContainer2.classList.add('hidden');
    imgContainer3.classList.add('hidden');
    imgContainer4.classList.add('hidden');
    logo.classList.add('hidden');
    // Show form
    form.classList.remove('hidden');
    backButton.classList.remove('hidden');
    formel.classList.remove('hidden');
    loadImage(e);
    currentImageElementId = 'img2';
    if (e.target.files.length > 0) {
        // Get the selected file
        const selectedFile = e.target.files[0];

        // Create a FileReader object to read the selected file
        const reader = new FileReader();

        // Set up the FileReader to load the selected file as a data URL
        reader.readAsDataURL(selectedFile);

        // When the FileReader has loaded the file, update the src attribute of the image tag
        reader.onload = function(e) {
            selectedImage.src = e.target.result;
            selectedImage.style.display = 'block'; // Show the image
        };
    }

});

img3.addEventListener('change', (e) => {
    imgContainer1.classList.add('hidden');
    imgContainer2.classList.add('hidden');
    imgContainer3.classList.add('hidden');
    imgContainer4.classList.add('hidden');
    logo.classList.add('hidden');
    // Show form
    form.classList.remove('hidden');
    backButton.classList.remove('hidden');
    formel.classList.remove('hidden');
    loadImage(e);
    currentImageElementId = 'img3';
    if (e.target.files.length > 0) {
        // Get the selected file
        const selectedFile = e.target.files[0];

        // Create a FileReader object to read the selected file
        const reader = new FileReader();

        // Set up the FileReader to load the selected file as a data URL
        reader.readAsDataURL(selectedFile);

        // When the FileReader has loaded the file, update the src attribute of the image tag
        reader.onload = function(e) {
            selectedImage.src = e.target.result;
            selectedImage.style.display = 'block'; // Show the image
        };
    }
})

form.addEventListener('submit', (e) => {
    selectedImage.style.display = 'none';
    sendImage(e);
});

backButton.addEventListener('click', () => {
    window.location.reload();
});

vButton.addEventListener('click', () => {
    ipcRenderer.send('python-script');
});








//Incase of emergency Break Glass...(AKA comments)
/*
const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
    const file = e.target.files[0];

    if(!isFileImage(file)) {
        alertError('Please select an image');
        return;
    }

    //Get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    };

    form.style.display = 'block';
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

// send image data to main
function sendImage(e) {
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    if(!img.files[0]) {
        alertError('Please upload an image');
        return;
    }

    if(width === '' || height === '') {
        alertError('Please fill in a height and width');
        return;
    }

    //send to mian using ipcRenderer
    ipcRenderer.send('image:resize', {
        imgPath,
        width,
        height,
    });
}

//catch the image:done event
ipcRenderer.on('image:done', () => {
    alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
});

//make sure file is image
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg'];
    return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center',
        }
    });
}

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center',
        }
    });
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
*/
