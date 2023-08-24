let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 200;
let c = canvas.getContext('2d');
let canvas_width = canvas.width;
let canvas_height = canvas.height;

input = document.getElementById('img');
let img = new Image();
let currentX = canvas_width / 2, currentY = canvas_height / 2;
let isDragging = false;
let offsetX, offsetY;

function clearCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

function handleImage(e) {
    img.src = URL.createObjectURL(e.target.files[0]);

    img.onload = function () {
        clearCanvas();
        c.drawImage(img, currentX, currentY, 400, 300);
        makeDraggable();
    };
}

function makeDraggable() {
    canvas.onmousedown = (e) => {
        let x = e.clientX, y = e.clientY;
        if (x <= (currentX + img.width / 2) && x >= (currentX - img.width / 2) &&
            y <= (currentY + img.height / 2) && y >= (currentY - img.height / 2)) {
            isDragging = true;
            offsetX = x - currentX;
            offsetY = y - currentY;
        } else {
            isDragging = false;
        }
    }

    canvas.onmousemove = (e) => {
        if (isDragging) {
            currentX = e.clientX - offsetX;
            currentY = e.clientY - offsetY;
            clearCanvas();
            c.drawImage(img, currentX, currentY, 400, 300);
        }
    }

    canvas.onmouseup = () => {
        isDragging = false;
    }

    canvas.onmouseout = () => {
        isDragging = false;
    }
}

input.addEventListener('change', handleImage);
