import os
import google.generativeai as genai
from dotenv import load_dotenv

# Cấu hình API Key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Chọn mô hình
model = genai.GenerativeModel("gemini-2.5-flash")

# Tạo prompt
prompt = "Viết một đoạn giới thiệu ngắn về trí tuệ nhân tạo."

# Nhận kết quả
response = model.generate_content(prompt)

print("AI trả lời:", response.text)
