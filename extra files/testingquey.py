

import textwrap
import google.generativeai as genai
from IPython.display import Markdown
import os

import google.generativeai as genai

genai.configure(api_key="AIzaSyBkMNdRdzcLFybcs3gHCVh34ndTMYFB2pE")

model = genai.GenerativeModel('gemini-pro')

response = model.generate_content("The opposite of hot is")
print(response.text)  # cold.