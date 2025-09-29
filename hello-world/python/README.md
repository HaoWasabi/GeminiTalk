# GeminiTalk - Hello World Python

Dự án đơn giản sử dụng Google Gemini AI để tạo chatbot "Hello World" bằng Python.

## Mô tả

Đây là một ứng dụng Python cơ bản sử dụng Google Generative AI (Gemini) để tạo ra phản hồi text. Ứng dụng sẽ gửi yêu cầu "Say Hello World!" đến Gemini và in ra kết quả.

## Cài đặt

### Yêu cầu hệ thống
- Python 3.7 trở lên
- Pip package manager

### Cài đặt dependencies

1. Tạo virtual environment (khuyến nghị):
```bash
python -m venv venv
```

2. Kích hoạt virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

3. Cài đặt các thư viện cần thiết:
```bash
pip install -r requirements.txt
```

### Cấu hình API Key

1. Tạo file `.env` trong thư mục này
2. Thêm API key của bạn:
```
GEMINI_API_KEY=your_api_key_here
```

**Lưu ý:** Để lấy API key, bạn cần:
- Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
- Tạo API key mới
- Copy và paste vào file `.env`

## Sử dụng

Chạy ứng dụng:
```bash
python main.py
```

Kết quả mong đợi:
```
Gemini trả lời: Hello World! 👋
```

## Cấu trúc file

```
python/
├── main.py              # File chính chứa code
├── requirements.txt     # Danh sách dependencies
├── .env                # File chứa API key (không commit)
└── README.md           # File hướng dẫn này
```

## Dependencies

- `google-generativeai`: Thư viện chính để tương tác với Gemini AI
- `python-dotenv`: Để đọc biến môi trường từ file .env

## Troubleshooting

### Lỗi "ModuleNotFoundError: No module named 'google'"
- Đảm bảo bạn đã cài đặt dependencies: `pip install -r requirements.txt`
- Kiểm tra virtual environment đã được kích hoạt

### Lỗi "API key not found"
- Kiểm tra file `.env` đã tồn tại và chứa `GEMINI_API_KEY`
- Đảm bảo API key hợp lệ

### Lỗi "Permission denied" hoặc "Quota exceeded"
- Kiểm tra API key có quyền truy cập Gemini API
- Kiểm tra quota sử dụng API

## Phát triển thêm

Dự án này có thể được mở rộng để:
- Tạo chatbot tương tác
- Xử lý nhiều loại input khác nhau
- Tích hợp với UI/web interface
- Thêm tính năng lưu trữ lịch sử chat
