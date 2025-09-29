# GeminiTalk - Hello World Google Apps Script

Dự án đơn giản sử dụng Google Gemini AI để tạo chatbot "Hello World" bằng Google Apps Script.

## Mô tả

Đây là phiên bản Google Apps Script của GeminiTalk, sử dụng Google Generative AI (Gemini) API để tạo ra phản hồi text. Ứng dụng sẽ gửi yêu cầu "Say Hello World!" đến Gemini và hiển thị kết quả trong Logger.

## Yêu cầu

- Tài khoản Google
- Truy cập vào Google Apps Script
- API Key từ Google AI Studio

## Cài đặt và Cấu hình

### 1. Tạo dự án Google Apps Script

1. Truy cập [Google Apps Script](https://script.google.com/)
2. Tạo dự án mới
3. Copy nội dung từ file `main.gs` vào editor

### 2. Lấy API Key

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Copy API key

### 3. Cấu hình API Key

Thay thế `"YOUR_API_KEY"` trong file `main.gs` bằng API key thật của bạn:

```javascript
var apiKey = "your_actual_api_key_here";
```

**⚠️ Lưu ý bảo mật:** 
- Không chia sẻ API key của bạn
- Có thể sử dụng Properties Service để lưu trữ API key an toàn hơn

### 4. Cấu hình Properties Service (Khuyến nghị)

Để bảo mật API key tốt hơn, sử dụng Properties Service:

1. Trong Apps Script Editor, vào **Project Settings**
2. Thêm Script Property:
   - Property: `GEMINI_API_KEY`
   - Value: `your_actual_api_key_here`

3. Sửa code để sử dụng Properties Service:
```javascript
var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
```

## Sử dụng

### Chạy function

1. Trong Apps Script Editor, chọn function `helloWorldGemini`
2. Click nút **Run** (▶️)
3. Xem kết quả trong **Execution transcript** hoặc **Logs**

### Xem kết quả

Kết quả sẽ được hiển thị trong Logger. Để xem:
1. Click **View** → **Logs** 
2. Hoặc sử dụng `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

Kết quả mong đợi:
```
Hello World! 👋
```

## Cấu trúc file

```
appscript/
├── main.gs         # File chính chứa function Google Apps Script
└── README.md       # File hướng dẫn này
```

## API Endpoint

Dự án sử dụng Gemini API endpoint:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

## Troubleshooting

### Lỗi "Exception: Request failed for https://generativelanguage.googleapis.com returned code 401"
- Kiểm tra API key có chính xác không
- Đảm bảo API key có quyền truy cập Gemini API

### Lỗi "Exception: Request failed for https://generativelanguage.googleapis.com returned code 403"
- Kiểm tra quota API
- Đảm bảo API đã được kích hoạt trong Google Cloud Console

### Lỗi "TypeError: Cannot read property 'candidates' of null"
- Kiểm tra response từ API
- Thêm error handling để xử lý trường hợp API trả về lỗi

## Cải tiến và Mở rộng

### Thêm Error Handling
```javascript
function helloWorldGeminiWithErrorHandling() {
  try {
    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('API key not found in Properties');
    }
    
    // ... rest of the code
    
    if (response.getResponseCode() !== 200) {
      throw new Error('API request failed: ' + response.getContentText());
    }
    
    // ... handle response
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}
```

### Tích hợp với Google Sheets
Có thể mở rộng để ghi kết quả vào Google Sheets:
```javascript
function writeToSheet(message) {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow([new Date(), message]);
}
```

### Tạo Web App
Có thể tạo web interface đơn giản bằng HTML Service.

## Phát triển thêm

Dự án này có thể được mở rộng để:
- Tạo chatbot tương tác với Google Sheets
- Tích hợp với Gmail để trả lời email tự động
- Tạo Google Forms với AI response
- Xây dựng web app đơn giản với HTML Service
- Tích hợp với Google Drive để xử lý documents

## Tài liệu tham khảo

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Generative AI API](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)