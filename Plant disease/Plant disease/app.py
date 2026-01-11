from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from PIL import Image
from io import BytesIO

app = Flask(__name__)

genai.configure(api_key="")
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/tips')
def tips():
    return render_template('tips.html')
@app.route('/temperature_care')
def temperature_care():
    return render_template('temperature_care.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        file = request.files['image']
        language = request.form.get('language', 'English')
        image_bytes = file.read()

        if not image_bytes:
            return jsonify({'error': 'Empty image file'}), 400

        img = Image.open(BytesIO(image_bytes))

        prompt = f"""
        You are a multilingual agricultural assistant. 
        Analyze the uploaded plant image and return the following:

        - Plant Name (if identifiable)
        - Disease Name
        - Symptoms
        - Cure
        - Prevention

        Format the output in a clean, easy-to-read way.
        Respond ONLY in {language}.
        """

        response = model.generate_content([prompt, img])
        return jsonify({'result': response.text.strip()})

    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)

