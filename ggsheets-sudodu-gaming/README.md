# ggsheets-sudodu-gaming

Hướng dẫn nhanh (tiếng Việt) để cài đặt và sử dụng bộ script Google Apps Script để chơi Sudoku trong Google Sheets.

## Mục đích
Thư mục này chứa một Google Apps Script (GAS) và các file HTML dialog để:
- Tạo ván Sudoku 9x9 bằng cách gọi API Gemini (Generative Language).
- Hiện dialog chọn độ khó, gợi ý cho ô, xem đáp án và kiểm tra lời giải.

## Nội dung thư mục
- `main.gs` — code GAS chính (menu, vẽ bảng, gọi API Gemini, xử lý gợi ý/đáp án).
- `answerDialog.html` — HTML dialog hiển thị đáp án.
- `hintDialog.html` — HTML dialog để nhập hàng/cột và nhận gợi ý (gọi `getSudokuHintForCell(row, col)`).
- `difficultyDialog.html` — dialog chọn độ khó (dễ/trung bình/khó).
- `loadingDialog.html` — dialog hiển thị trạng thái "Đang xử lý".
- `create_sudoku_prompt.txt`, `hint_sudoku_prompt.txt` — prompt mẫu dùng để gọi Gemini (tham khảo/tuỳ chỉnh).

> Lưu ý: tên thư mục trong repo là `ggsheets-sudodu-gaming` (có thể là lỗi chính tả). Nếu bạn muốn đặt tên khác khi tạo project, không ảnh hưởng đến code.

## Yêu cầu
- Tài khoản Google và quyền chỉnh sửa Google Sheets.
- Quyền truy cập Google Apps Script (mở Extensions -> Apps Script trong Google Sheets).
- Một API key hợp lệ cho Generative Language (Gemini) — đặt vào Script Properties với tên khóa `GEMINI_API_KEY`.

## Cách cài đặt (bước từng bước)
1. Mở Google Sheets (hoặc tạo một sheet mới).
2. Mở Apps Script: Extensions → Apps Script (hoặc Tools → Script editor tuỳ phiên bản).
3. Tạo một project mới hoặc mở project đã có.
4. Thêm các file vào project Apps Script:
   - Tạo file `Code.gs` (hoặc `main.gs`) và dán nội dung từ file `main.gs` trong thư mục này.
   - Tạo các file HTML tương ứng và dán nội dung từ `answerDialog.html`, `hintDialog.html`, `difficultyDialog.html`, `loadingDialog.html`.
5. Thiết lập Script Properties (đặt API key):
   - Trong Apps Script editor, vào `File` → `Project properties` → tab `Script properties` (hoặc vào `Project settings` tuỳ giao diện).
   - Thêm biến `GEMINI_API_KEY` = `YOUR_API_KEY_HERE` (thay bằng key thật từ Google Cloud / console).
6. Lưu project.
7. Ủy quyền chạy script: lần đầu chạy hàm `onOpen` hoặc một hàm khác, Apps Script sẽ yêu cầu cấp quyền (UrlFetch, PropertiesService...). Chấp nhận các quyền cần thiết.
8. Quay lại Google Sheets, tải lại trang nếu cần — menu `Sudoku` sẽ xuất hiện trên thanh menu.

## Cách sử dụng
- Mở menu `Sudoku` → chọn `Ván mới` để bắt đầu ván mới. Một dialog sẽ hỏi độ khó.
- Sau khi chọn độ khó, script sẽ gọi API Gemini để tạo puzzle và vẽ bảng trên sheet (sheet tên `SUDOKU`).
- Dùng menu `Gợi ý` để mở dialog nhập hàng và cột (1–9) → script gọi `getSudokuHintForCell(row, col)` để trả về gợi ý ngắn bằng tiếng Việt.
- Dùng menu `Đáp án` để hiển thị lời giải (ô gốc vẫn giữ màu xám, ô lời giải được tô màu nhẹ).
- Dùng menu `Kiểm tra lời giải` để kiểm tra toàn bộ bảng — các ô sai sẽ được đánh dấu đỏ.

## Các điểm quan trọng / Troubleshooting
- Lỗi "Chưa cấu hình GEMINI_API_KEY": bạn chưa đặt `GEMINI_API_KEY` trong Script Properties.
- Lỗi JSON / "Không đọc được JSON từ Gemini": kiểm tra API key, hạn mức (quota), và định dạng phản hồi từ API.
- Nếu dialog gợi ý báo lỗi: kiểm tra bạn đã nhập đúng hàng/cột (1–9) và đã tạo ván Sudoku trước đó.
- Script dùng `UrlFetchApp` để gọi API; lần đầu chạy sẽ yêu cầu quyền truy cập mạng — hãy cho phép.

## Tuỳ chỉnh
- Bạn có thể tuỳ chỉnh prompt mẫu trong `create_sudoku_prompt.txt` và `hint_sudoku_prompt.txt` để thay đổi cách Gemini sinh puzzle/gợi ý.
- Nếu muốn thay đổi vị trí hiển thị bảng, sửa `startRow` và `startCol` trong `main.gs`.

## Ghi chú kỹ thuật ngắn
- Các function chính trong `main.gs`:
  - `onOpen()` — thêm menu `Sudoku`.
  - `startNewSudoku()` / `createSudokuWithDifficulty(level)` — khởi tạo ván mới.
  - `drawSudoku(level)` — vẽ puzzle lên sheet.
  - `getSudokuFromGemini(level)` — gọi Gemini để lấy puzzle + solution.
  - `getSudokuHintForCell(row, col)` — gửi trạng thái hiện tại + puzzle/solution đến Gemini để lấy gợi ý cho ô.
  - `getSudokuSolution()` — điền đáp án vào sheet.
  - `checkFullSolution()` — kiểm tra toàn bộ lời giải.
