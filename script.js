const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const ctx = overlay.getContext('2d');
let isDoodling = false;
let drawing = false;
let doodlePaths = [];
let currentPath = [];

// Start webcam for single video element
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    alert('Error accessing webcam: ' + error.message);
  }
}

// Adjust canvas size to match video
video.addEventListener('loadedmetadata', () => {
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
});

// Add text overlay
function addText() {
  const text = document.getElementById('textInput').value;
  const color = document.getElementById('textColor').value;
  ctx.font = '30px Comic Sans MS';
  ctx.fillStyle = color;
  ctx.fillText(text, 50, 50); // Fixed position
}

// Add emoji overlay
function addEmoji() {
  const emoji = document.getElementById('emojiSelect').value;
  const x = Math.random() * (overlay.width - 50);
  const y = Math.random() * (overlay.height - 50);
  ctx.font = '40px Arial';
  ctx.fillText(emoji, x, y);
}

// Toggle doodle functionality
function toggleDoodle() {
  isDoodling = !isDoodling;
  overlay.style.pointerEvents = isDoodling ? 'auto' : 'none';
}

// Doodle drawing functionality
overlay.addEventListener('mousedown', (event) => {
  if (!isDoodling) return;
  drawing = true;
  currentPath = [];
  addPoint(event);
});
overlay.addEventListener('mouseup', () => {
  if (!isDoodling) return;
  drawing = false;
  doodlePaths.push([...currentPath]);
});
overlay.addEventListener('mousemove', (event) => {
  if (!isDoodling) return;
  updateCanvas(event);
});

// Add points to the current doodle path
function addPoint(event) {
  const rect = overlay.getBoundingClientRect();
  currentPath.push({ x: event.clientX - rect.left, y: event.clientY - rect.top });
}

// Update canvas with doodles and pointer
function updateCanvas(event) {
  const rect = overlay.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  // Redraw all doodles
  doodlePaths.forEach(path => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff0000';
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
  });

  // Draw the current path
  if (drawing && currentPath.length > 0) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff0000';
    ctx.moveTo(currentPath[0].x, currentPath[0].y);
    for (let i = 1; i < currentPath.length; i++) {
      ctx.lineTo(currentPath[i].x, currentPath[i].y);
    }
    ctx.stroke();
    addPoint(event);
  }

  // Draw the custom pointer
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
}

// Initialize webcam
startCamera();

function changeFont() {
  var selectedFont = document.getElementById('fontSelector').value;
  document.body.style.fontFamily = selectedFont;
}
let gifElement = null;

// Add GIF to overlay
function addGif() {
  const gifUrl = document.getElementById('gifSelect').value;
  if (gifElement) {
    gifElement.remove();
  }
  gifElement = document.createElement('img');
  gifElement.src = gifUrl;
  gifElement.style.position = 'absolute';
  gifElement.style.top = '20px';
  gifElement.style.right = '20px';
  gifElement.style.width = '200px';
  gifElement.style.height = '200px';
  gifElement.style.zIndex = '5';
  const videoContainer = document.querySelector('.video-container');
  videoContainer.appendChild(gifElement);
}

// Function to clear all added elements (like the video and GIF)
function clearAll() {
  const gifElement = document.querySelector('.video-container img');
  if (gifElement) {
    gifElement.remove();
  }
  const emojiElements = document.querySelectorAll('.emoji');
  emojiElements.forEach((emoji) => emoji.remove());
  const textElements = document.querySelectorAll('.text');
  textElements.forEach((text) => text.remove());
}

document.getElementById('clearAllBtn').addEventListener('click', clearAll);
