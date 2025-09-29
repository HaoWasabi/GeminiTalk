import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Cấu hình Gemini
genai.configure(api_key=api_key)

# Gửi yêu cầu "Hello World"
response = genai.GenerativeModel("gemini-2.5-flash").generate_content("Say Hello World!")

print("Gemini trả lời:", response.text)
