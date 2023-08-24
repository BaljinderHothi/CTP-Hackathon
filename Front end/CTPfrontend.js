const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = 1920;
const canvasHeight = 1000; // Adjusted to accommodate the bottom bar

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const canvasState = [];

function renderCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const cell of canvasState) {
        const { x, y, imageSrc } = cell;
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            ctx.drawImage(image, x, y);
        };
    }
}



// Get references to the necessary elements
const menuLink = document.getElementById("menuLink");
const popupContainer = document.getElementById("popupContainer");

// Open the pop-up when the menu link is clicked
menuLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    popupContainer.style.display = "flex"; // Display the pop-up
});

// Close the pop-up when the user clicks outside the content area
popupContainer.addEventListener("click", function (event) {
    if (event.target === popupContainer) {
        popupContainer.style.display = "none"; // Hide the pop-up
    }
});

// Other area where the image location and placement code can go. Preferrably goes here as JS makes the x and y coordinates aspect easier

renderCanvas();