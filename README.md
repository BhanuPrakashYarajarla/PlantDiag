# 🌱 Plant Disease Identification and Cure

##  Overview
This project is a web-based application that identifies plant species and detects diseases using image recognition. It provides users with plant care recommendations and treatment suggestions based on identified diseases.

##  Features
- 📷 **Camera-based scanning**: Capture plant images using a webcam.
- 📂 **Image upload support**: Upload images from local storage.
- 🌿 **Plant identification**: Detect plant species using the Perenual API.
- 🦠 **Disease detection**: Uses a trained machine learning model (TensorFlow.js) to identify diseases.
- 💊 **Treatment suggestions**: Provides care recommendations for detected diseases.
- 🔄 **Real-time scanning**: Continuously scan plants for identification.
- ⏹️ **Auto camera shutdown**: Stops the camera when not in use.

##  Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Frameworks/Libraries**: TensorFlow.js, Bootstrap
- **APIs**: [Perenual Plant API](https://perenual.com/)
- **Machine Learning**: Pre-trained ML models for disease identification

##  Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/plant-disease-identification.git
   cd plant-disease-identification
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the application:**
   ```sh
   npm start
   ```

##  Usage
1. Click **Start Camera** to enable live scanning or upload an image.
2. Click **Scan** to identify the plant and detect diseases.
3. View the plant name, detected disease, and suggested cure.
4. Stop the camera when done to save resources.

##  API Configuration
To use the **Perenual API**, obtain an API key from [Perenual](https://perenual.com/) and add it to the project:
```js
const PERENUAL_API_KEY = 'your-api-key-here';
```

##  Machine Learning Model
- The disease detection model is built using TensorFlow.js.
- Pretrained with plant disease datasets.
- Can be replaced with a custom-trained model for better accuracy.

##  Future Enhancements
- 🌍 **Multilingual support**
- 📊 **Improved ML model with higher accuracy**
- 🔎 **More plant species and disease database**
- 📱 **Mobile PWA support**

##  Contributing
Contributions are welcome! If you’d like to improve the project:
1. Fork the repository.
2. Create a new feature branch (`feature-new`).
3. Commit your changes.
4. Open a pull request.

---
🌿 **Happy Planting!** 🌿

