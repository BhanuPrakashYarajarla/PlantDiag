// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('startBtn');
const scanBtn = document.getElementById('scanBtn');
const uploadBtn = document.getElementById('uploadBtn');
const uploadInput = document.getElementById('uploadInput');
const snapshot = document.getElementById('snapshot');
const plantName = document.getElementById('plantName');
const disease = document.getElementById('disease');
const cure = document.getElementById('cure');

let stream;
let scanning = false;
const PERENUAL_API_KEY = 'sk-mAAM67e517fa627559439'; // Your Perenual API key
let speciesList = []; // Cache for species list

// Disease database
const diseaseDatabase = {
    "healthy": "Maintain regular watering and sunlight.",
    "powdery_mildew": "Apply neem oil or sulfur fungicide.",
    "leaf_spot": "Remove affected leaves, use copper-based fungicide.",
    "rust": "Use sulfur fungicide, remove infected parts.",
    "scab": "Apply captan fungicide, prune for air flow.",
    "blast": "Use tricyclazole fungicide, manage water."
};

// Mock disease labels (replace with your trained model's labels)
const diseaseLabels = ["healthy", "powdery_mildew", "leaf_spot", "rust", "scab", "blast"];

// Fetch species list from Perenual API on page load
async function fetchSpeciesList() {
    const url = `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        speciesList = data.data; // Cache the species list
    } catch (err) {
        console.error('Error fetching species list:', err);
        speciesList = [];
    }
}

// Stop camera function
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        startBtn.textContent = 'Start Camera';
        startBtn.disabled = false;
        scanBtn.disabled = true;
    }
}

// Start camera
startBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        startBtn.textContent = 'Camera Started';
        startBtn.disabled = true;
        scanBtn.disabled = false;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access camera. Please ensure permissions are granted.');
    }
});

// Toggle real-time scanning
scanBtn.addEventListener('click', () => {
    if (!scanning) {
        scanning = true;
        scanBtn.textContent = 'Stop Scanning';
        startScanning();
    } else {
        scanning = false;
        scanBtn.textContent = 'Start Scanning';
        snapshot.innerHTML = '';
        stopCamera(); // Stop the camera when scanning is stopped
    }
});

// Real-time scanning function
function startScanning() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const scanInterval = setInterval(async () => {
        if (!scanning) {
            clearInterval(scanInterval);
            return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        snapshot.innerHTML = `<img src="${imageData}" alt="Scanned Plant">`;
        await processImage(imageData);
    }, 3000); // 3-second interval
}

// Upload image
uploadBtn.addEventListener('click', () => uploadInput.click());
uploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target.result;
            snapshot.innerHTML = `<img src="${imageData}" alt="Uploaded Plant">`;
            uploadBtn.textContent = 'Processing...';
            uploadBtn.disabled = true;
            await processImage(imageData);
            uploadBtn.textContent = 'Upload Image';
            uploadBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

// Process image
async function processImage(imageData) {
    try {
        plantName.textContent = 'Identifying...';
        disease.textContent = 'Analyzing...';
        cure.textContent = 'Searching...';

        // Step 1: Mock plant identification using species-list
        let detectedPlant = 'Unknown Plant';
        if (speciesList.length > 0) {
            const randomPlant = speciesList[Math.floor(Math.random() * speciesList.length)];
            detectedPlant = randomPlant.common_name || randomPlant.scientific_name[0] || 'Unknown Plant';
        }
        plantName.textContent = detectedPlant;

        // Step 2: Detect disease using TensorFlow.js (mocked for now)
        const detectedDisease = await detectDisease(imageData);
        disease.textContent = detectedDisease.replace('_', ' ');

        // Step 3: Provide cure
        const cureInfo = diseaseDatabase[detectedDisease] ||
            `Visit https://www.google.com/search?q=${encodeURIComponent(`${detectedPlant} ${detectedDisease} treatment`)} for more info.`;
        cure.textContent = cureInfo;

    } catch (err) {
        console.error('Error processing image:', err);
        plantName.textContent = 'Error: ' + (err.message || 'Unknown error');
        disease.textContent = 'Error';
        cure.textContent = 'Error';
    }
}

// Mock Disease Detection with TensorFlow.js
async function detectDisease(imageData) {
    try {
        // Ensure the image is loaded in the snapshot
        const imgElement = snapshot.querySelector('img');
        if (!imgElement) {
            throw new Error('No image found in snapshot');
        }

        // Wait for the image to fully load if necessary
        if (!imgElement.complete || imgElement.naturalWidth === 0) {
            await new Promise(resolve => imgElement.onload = resolve);
        }

        let tensor = tf.browser.fromPixels(imgElement)
            .resizeNearestNeighbor([224, 224]) // Resize to 224x224 (common for MobileNet)
            .toFloat()
            .div(tf.scalar(255)) // Normalize to [0, 1]
            .expandDims(); // Add batch dimension

        // Mock prediction (replace with your trained model)
        const mockPrediction = Math.random() * diseaseLabels.length;
        const diseaseIndex = Math.floor(mockPrediction);
        const detectedDisease = diseaseLabels[diseaseIndex];

        tensor.dispose(); // Clean up memory
        return detectedDisease;
    } catch (err) {
        console.error('Error detecting disease:', err);
        return 'unknown';
    }
}

// Stop camera when the user switches tabs or leaves the page
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopCamera();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', stopCamera);

// Fetch species list on page load
fetchSpeciesList();
