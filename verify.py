import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load the model from your saved location
model = tf.keras.models.load_model('/content/drive/MyDrive/verification_model.h5')

# Define a function to load and preprocess the image
def load_and_preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize
    return img_array

# Define a prediction function
def predict_image_class(img_path, threshold=0.7):
    img_array = load_and_preprocess_image(img_path)
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions, axis=1)
    predicted_probability = np.max(predictions)
    
    
    # Define class labels
    class_labels = ['electricity','garbage','road','unknown','water logging']
    
    if predicted_probability >= threshold:
        return f'Predicted class: {class_labels[predicted_class_index[0]]}'
    else:
        return 'Predicted class: Unknown (below confidence threshold)'

# Test with a new image
#img_path = '/content/drive/MyDrive/ipm_dataset/unknown/image1007.jpg'
#result = predict_image_class(img_path)
#print(result)