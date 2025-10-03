# To run this code you need to install the following dependencies:
# pip install google-genai python-dotenv

from dotenv import load_dotenv
import os
from google import genai
from google.genai import types

# Load biến môi trường từ file .env
load_dotenv()

def generate():
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
    )

    # Model chỉ cần bản text (không dùng image)
    model = "gemini-2.0-flash"

    # Nội dung prompt
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="Giới thiệu về trí tuệ nhân tạo"),
            ],
        ),
    ]

    # Config chỉ dành cho text
    generate_content_config = types.GenerateContentConfig(
        temperature=0.9,
        top_p=0.85,
        max_output_tokens=200,
        response_modalities=["TEXT"],
    )

    # Stream output text
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            chunk.candidates
            and chunk.candidates[0].content
            and chunk.candidates[0].content.parts
        ):
            print(chunk.text, end="", flush=True)

if __name__ == "__main__":
    generate()
