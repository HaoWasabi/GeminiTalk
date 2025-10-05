function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Game") // Tạo menu riêng trong Sheets
    .addItem("Sudoku", "showSudokuSidebar")
    .addToUi();
}

function showSudokuSidebar() {
  var html = HtmlService.createHtmlOutputFromFile("sudokuSidebar")
    .setTitle("Gemini Gaming")
    .setWidth(300); // chiều rộng sidebar
  SpreadsheetApp.getUi().showSidebar(html);
}

function showSudokuAnswerDialog() {
  var html = HtmlService.createHtmlOutputFromFile("sudokuAnswer")
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Đáp án");
}

function showSudokuHintDialog() {
  var html = HtmlService.createHtmlOutputFromFile("sudokuHint")
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Gợi ý");
}

function drawSudoku() {
  var lastPuzzleStr = PropertiesService.getScriptProperties().getProperty("SUDOKU_PUZZLE");
  var lastPuzzle = lastPuzzleStr ? JSON.parse(lastPuzzleStr) : null;

  var data, puzzle, solution;
  var maxTries = 5; // tránh vòng lặp vô tận
  for (var i = 0; i < maxTries; i++) {
    data = getSudokuFromGemini();
    puzzle = data.puzzle;
    solution = data.solution;

    if (!lastPuzzle || !isSamePuzzle(puzzle, lastPuzzle)) {
      break; // tìm được puzzle khác
    }
  }

  if (!puzzle) throw new Error("Không lấy được puzzle mới từ Gemini");

  // Lưu lại puzzle + solution cho lần sau
  PropertiesService.getScriptProperties().setProperty("SUDOKU_PUZZLE", JSON.stringify(puzzle));
  PropertiesService.getScriptProperties().setProperty("SUDOKU_SOLUTION", JSON.stringify(solution));

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SUDOKU");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("SUDOKU");
  }

  var startRow = 4;
  var startCol = 3;

  // Vẽ Sudoku puzzle
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cell = sheet.getRange(startRow + r, startCol + c);
      if (puzzle[r][c] !== 0) {
        cell.setValue(puzzle[r][c]);
        cell.setBackground("#d9d9d9");
      } else {
        cell.setValue("");
        cell.setBackground(null);
      }
      cell.setHorizontalAlignment("center");
      cell.setVerticalAlignment("middle");
      cell.setFontWeight("bold");
    }
  }

  // chỉnh kích thước + viền
  sheet.setColumnWidths(startCol, 9, 30);
  sheet.setRowHeights(startRow, 9, 30);
  sheet.getRange(startRow, startCol, 9, 9).setBorder(false, false, false, false, false, false);
  sheet.getRange(startRow, startCol, 9, 9).setBorder(true, true, true, true, true, true);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var r = startRow + i*3;
      var c = startCol + j*3;
      sheet.getRange(r, c, 3, 3)
        .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    }
  }
  sheet.getRange(startRow, startCol, 9, 9)
    .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}

function isSamePuzzle(p1, p2) {
  if (!p1 || !p2) return false;
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (p1[r][c] !== p2[r][c]) return false;
    }
  }
  return true;
}

function getSudokuFromGemini() {
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Chưa cấu hình GEMINI_API_KEY trong Script Properties");

  var prompt = `
Hãy trả về duy nhất một đối tượng JSON biểu diễn một trò chơi Sudoku 9x9 mức dễ.
Quy tắc:
- Không thêm giải thích, không thêm chữ nào ngoài JSON.
- JSON gồm các trường: "title", "size", "difficulty", "puzzle", "solution".
- "difficulty" đặt là "easy".
- "puzzle" là ma trận 9x9 với số 0 đại diện cho ô trống.
- "solution" là lời giải đầy đủ 9x9.

Trả về trực tiếp JSON.
`;

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
  var payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var res = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(res.getContentText());

  try {
    var text = json.candidates[0].content.parts[0].text;
    // Loại bỏ ```json ... ``` nếu có
    text = text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Không đọc được JSON từ Gemini: " + res.getContentText());
  }
}

// Hiện modal loading
function showLoadingModal() {
  var html = HtmlService.createHtmlOutputFromFile("loadingModal")
    .setWidth(360)
    .setHeight(140);
  SpreadsheetApp.getUi().showModalDialog(html, "Đang xử lý");
}

// Trả về trạng thái hiện tại: "idle" | "loading" | "done" | "error"
function checkSudokuStatus() {
  var status = PropertiesService.getScriptProperties().getProperty("SUDOKU_STATUS");
  return status || "idle";
}

// Gọi từ sidebar khi muốn tạo ván mới.
// Thiết lập status, mở modal, vẽ sudoku, rồi cập nhật status thành done/error.
function startNewSudoku() {
  // Đặt trạng thái loading trước
  PropertiesService.getScriptProperties().setProperty("SUDOKU_STATUS", "loading");

  // Hiện modal (không chặn tiếp tục hàm này)
  showLoadingModal();

  try {
    // Gọi hàm vốn đã vẽ Sudoku vào sheet (nếu bạn để logic gọi Gemini trong drawSudoku)
    drawSudoku();

    // Vẽ xong → đánh dấu done
    PropertiesService.getScriptProperties().setProperty("SUDOKU_STATUS", "done");
  } catch (e) {
    // Nếu lỗi → đánh dấu error để modal hiển thị lỗi
    PropertiesService.getScriptProperties().setProperty("SUDOKU_STATUS", "error");
    // vẫn ném lỗi lên caller (nếu cần)
    throw e;
  }
}