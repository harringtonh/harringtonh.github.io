const baseCanvas = document.getElementById('baseCanvas');
const drawingCanvas = document.getElementById('drawingCanvas');
const ctxBase = baseCanvas.getContext('2d');
const ctxDrawing = drawingCanvas.getContext('2d');
const colors = document.querySelectorAll('.color');

// Set canvas dimensions
const width = 800;
const height = 600;
baseCanvas.width = width;
baseCanvas.height = height;
drawingCanvas.width = width;
drawingCanvas.height = height;

// Load and draw the locked PNG base layer
const baseImage = new Image();
baseImage.src = 'your-image.png'; // Replace with your PNG file
baseImage.onload = () => {
    ctxBase.drawImage(baseImage, 0, 0, width, height);
};

// Drawing state
let drawing = false;
let color = 'black';
let layers = []; // Store each line as a layer

// Event listeners for color buttons
colors.forEach(button => {
    button.addEventListener('click', () => {
        color = button.getAttribute('data-color');
    });
});

// Drawing functions
function startDrawing(event) {
    drawing = true;
    ctxDrawing.beginPath();
    ctxDrawing.moveTo(event.offsetX, event.offsetY);
}

function draw(event) {
    if (!drawing) return;
    ctxDrawing.strokeStyle = color;
    ctxDrawing.lineWidth = 2;
    ctxDrawing.lineCap = 'round';
    ctxDrawing.lineTo(event.offsetX, event.offsetY);
    ctxDrawing.stroke();
}

function stopDrawing(event) {
    if (!drawing) return;
    drawing = false;
    ctxDrawing.closePath();

    // Save the line as a layer
    const layer = {
        color: color,
        points: ctxDrawing.getImageData(0, 0, width, height),
    };
    layers.push(layer);

    // Clear the drawing canvas
    ctxDrawing.clearRect(0, 0, width, height);

    // Redraw all layers onto the drawing canvas
    redrawLayers();
}

function redrawLayers() {
    layers.forEach(layer => {
        ctxDrawing.putImageData(layer.points, 0, 0);
    });
}

// Attach events to the drawing canvas
drawingCanvas.addEventListener('mousedown', startDrawing);
drawingCanvas.addEventListener('mousemove', draw);
drawingCanvas.addEventListener('mouseup', stopDrawing);
drawingCanvas.addEventListener('mouseout', stopDrawing);
