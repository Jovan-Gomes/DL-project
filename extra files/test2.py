import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np

# Load the ResNet50 model pre-trained on ImageNet data
model = ResNet50(weights='imagenet')

img_path = r'C:\Users\Jovan\Desktop\eucalyptus.jpg'  # Replace with the path to your image file
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = preprocess_input(img_array)

# Make predictions
predictions = model.predict(img_array)

# Decode and print the top 5 predicted classes and their probabilities
decoded_predictions = decode_predictions(predictions, top=5)[0]

print("Top 5 Predictions:")
for i, (imagenet_id, label, score) in enumerate(decoded_predictions):
    print(f"{i + 1}: {label} ({score:.2f})")



#objects = ["mountain", "stars", "falls", "bird", "tree", "house", "dog", "rain"]

#pip install -q -U google-generativeai

import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# Used to securely store your API key
#from google.colab import userdata

# Or use `os.getenv('GOOGLE_API_KEY')` to fetch an environment variable.
#GOOGLE_API_KEY=userdata.get('GOOGLE_API_KEY')

genai.configure(api_key="AIzaSyBjooTOhwlZmslBwpq584KzNu7hY13lIkY")     #AIzaSyBjooTOhwlZmslBwpq584KzNu7hY13lIkY


for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)


model = genai.GenerativeModel('gemini-pro')

objects=decoded_predictions

#objects = ["mountain", "stars", "falls", "bird", "tree", "house", "dog", "rain"]
# Extract labels from decoded_predictions   
labels = [label for _, label, _ in decoded_predictions]       #ADDED THIS

# Convert labels to strings and join them
objects = ', '.join(labels)

prompt = f"""You are a information generator.
Your task is to generate an abstract text given a list of words.
The text must list out the properties of this plant and explain a few of it's uses.
Generate a small abstract text given the following list of words: {objects}\n"""
print(prompt)
response = model.generate_content(prompt)


to_markdown(response.text)

# ADDED THIS
import markdown2

# Convert Markdown text to plain text
plain_text = markdown2.markdown(response.text, extras=["markdown-in-html", "tables"])

# Print the plain text
print(plain_text)

