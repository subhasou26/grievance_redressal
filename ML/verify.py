import sys
import requests
from io import BytesIO
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load the model
model = tf.keras.models.load_model('ML/verification_model.h5')

def load_and_preprocess_image_from_url(url):
    response = requests.get(url)
    img = image.load_img(BytesIO(response.content), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize
    return img_array

def predict_image_class_from_url(url, threshold=0.7):
    img_array = load_and_preprocess_image_from_url(url)
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions, axis=1)
    predicted_probability = np.max(predictions)
    
    # Define class labels
    class_labels = ['electricity', 'garbage', 'road', 'unknown', 'water logging']
    
    if predicted_probability >= threshold:
        return f'Predicted class: {class_labels[predicted_class_index[0]]}'
    else:
        return 'Predicted class: Unknown (below confidence threshold)'

if __name__ == "__main__":
    # Get the image URL from the command line argument
    image_url = sys.argv[1]
    result = predict_image_class_from_url(image_url)
    print(result)
