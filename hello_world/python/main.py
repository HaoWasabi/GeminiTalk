# To run this code you need to install the following dependencies:
# pip install google-genai python-dotenv

from dotenv import load_dotenv
import os
from google import genai
from google.genai import types

# Load biến môi trường từ file .env
load_dotenv()

def generate():
    # Khởi tạo client với API key
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
    )

    # Model text
    model = "gemini-2.0-flash"

    # Prompt: Say hello world
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="Say hello world"),
            ],
        ),
    ]

    # Config cho response text
    generate_content_config = types.GenerateContentConfig(
        response_modalities=["TEXT"],
    )

    # Gửi request và nhận response
    response_stream = client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    )
    
    # In response từ Gemini
    for chunk in response_stream:
        if chunk.text:
            print(chunk.text, end="")
    
if __name__ == "__main__":
    generate()
