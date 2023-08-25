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
let imgX, imgY; // send these variables to data base if someone clicks submit , use temp submit button

function clearCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height); 
    // run for loop of data
    //c.drawImage('backdrop.jpg',0,0,30,50);
}

function handleImage(e) {
    img.src = "backdrop.jpg"; // change how you input src
    console.log(e.target.files[0]);
    console.log(img.src);

    img.onload = function () {
        clearCanvas();
        c.drawImage(img, currentX, currentY, 100, 100);
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
            imgX = currentX;
            imgY = currentY;
            c.drawImage(img, currentX, currentY, 100, 100);
        }
    }

    canvas.onmouseup = () => {
        console.log(imgX, imgY);
        document.getElementById("change").innerHTML = `X Coordinate: ${imgX}, Y Coordinate: ${imgY}`;
        isDragging = false;
    }

    canvas.onmouseout = () => {
        isDragging = false;
    }
}

input.addEventListener('change', handleImage);