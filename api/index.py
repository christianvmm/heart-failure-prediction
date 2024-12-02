from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

model = load_model('model.keras')

@app.route('/predict', methods=['POST'])
def predict():
   data = request.get_json()
   input_data = np.array([
      data['age'], 
      data['sex'], 
      data['chestPainType'], 
      data['restingBP'], 
      data['cholesterol'], 
      data['fastingBS'], 
      data['restingECG'], 
      data['maxHR'], 
      data['exerciseAngina'], 
      data['oldPeak'], 
      data['stSlope']
   ])
    
   input_data = input_data.reshape(1, -1)

   print(input_data)
   
   predictions = model.predict(input_data)

   return jsonify({'predictions': predictions.tolist()})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
