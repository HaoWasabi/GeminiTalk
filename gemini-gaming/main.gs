/**************************************************
 * 🎮 MENU & UI KHỞI TẠO
 **************************************************/

// Khi mở file Google Sheets → tạo menu "Game"
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Sudoku") // menu riêng
    .addItem("Ván mới", "startNewSudoku")
    .addItem("Đáp án", "showSudokuAnswerDialog")
    .addItem("Gợi ý", "showSudokuHintDialog")
    .addToUi();
}

// Hiện dialog xem đáp án
function showSudokuAnswerDialog() {
  var html = HtmlService.createHtmlOutputFromFile("sudokuAnswer")
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Đáp án");
}

// Hiện dialog gợi ý
function showSudokuHintDialog() {
  var html = HtmlService.createHtmlOutputFromFile("sudokuHint")
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Gợi ý");
}


/**************************************************
 * 📝 VẼ & XỬ LÝ LƯỚI SUDOKU
 **************************************************/

// Vẽ Sudoku mới vào sheet
function drawSudoku() {
  var lastPuzzleStr = PropertiesService.getScriptProperties().getProperty("SUDOKU_PUZZLE");
  var lastPuzzle = lastPuzzleStr ? JSON.parse(lastPuzzleStr) : null;

  var data, puzzle, solution;
  var maxTries = 5; // tránh vòng lặp vô tận

  for (var i = 0; i < maxTries; i++) {
    data = getSudokuFromGemini();
    puzzle = data.puzzle;
    solution = data.solution;

    if (!lastPuzzle || !isSamePuzzle(puzzle, lastPuzzle)) break;
  }

  if (!puzzle) throw new Error("Không lấy được puzzle mới từ Gemini");

  // Lưu puzzle và solution
  PropertiesService.getScriptProperties().setProperty("SUDOKU_PUZZLE", JSON.stringify(puzzle));
  PropertiesService.getScriptProperties().setProperty("SUDOKU_SOLUTION", JSON.stringify(solution));

  // Tạo hoặc lấy sheet Sudoku
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SUDOKU");
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("SUDOKU");

  var startRow = 4, startCol = 3;

  // Điền dữ liệu Sudoku
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cell = sheet.getRange(startRow + r, startCol + c);
      if (puzzle[r][c] !== 0) {
        cell.setValue(puzzle[r][c]).setBackground("#d9d9d9");
      } else {
        cell.setValue("").setBackground(null);
      }
      cell.setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setFontWeight("bold");
    }
  }

  // Căn chỉnh bảng và viền
  sheet.setColumnWidths(startCol, 9, 30);
  sheet.setRowHeights(startRow, 9, 30);
  sheet.getRange(startRow, startCol, 9, 9).setBorder(true, true, true, true, true, true);

  // Vẽ viền đậm cho từng block 3x3
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      sheet.getRange(startRow + i*3, startCol + j*3, 3, 3)
        .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    }
  }
}

// So sánh 2 puzzle
function isSamePuzzle(p1, p2) {
  if (!p1 || !p2) return false;
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (p1[r][c] !== p2[r][c]) return false;
    }
  }
  return true;
}


/**************************************************
 * 🤖 LẤY DỮ LIỆU TỪ GEMINI API
 **************************************************/

// Gọi Gemini API để tạo Sudoku mới
function getSudokuFromGemini() {
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Chưa cấu hình GEMINI_API_KEY trong Script Properties");

  var prompt = `
Hãy trả về duy nhất một đối tượng JSON biểu diễn một trò chơi Sudoku 9x9 mức dễ.
Quy tắc:
- Không thêm giải thích, không thêm chữ nào ngoài JSON.
- JSON gồm: "title", "size", "difficulty", "puzzle", "solution".
- "difficulty" = "easy".
- "puzzle": ma trận 9x9 (0 là ô trống).
- "solution": lời giải đầy đủ 9x9.
`;

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
  var payload = { contents: [{ parts: [{ text: prompt }]}] };

  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  var json = JSON.parse(res.getContentText());

  try {
    var text = json.candidates[0].content.parts[0].text;
    text = text.replace(/```json|```/g, "").trim(); // loại bỏ markdown
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Không đọc được JSON từ Gemini: " + res.getContentText());
  }
}


/**************************************************
 * ⏳ QUẢN LÝ TRẠNG THÁI & LOADING
 **************************************************/

function showLoadingModal() {
  var html = HtmlService.createHtmlOutputFromFile("loadingModal")
    .setWidth(360).setHeight(140);
  SpreadsheetApp.getUi().showModalDialog(html, "Đang xử lý");
}

function checkSudokuStatus() {
  var status = PropertiesService.getScriptProperties().getProperty("SUDOKU_STATUS");
  return status || "idle";
}

// Bắt đầu ván Sudoku mới
function startNewSudoku() {
  PropertiesService.getScriptProperties().setProperty("SUDOKU_STATUS", "loading");
  showLoadingModal();

  try {
    drawSudoku();
    PropertiesService.getScriptProperties().setProperty("SUDOKU_STATUS", "done");
  } catch (e) {
    PropertiesService.getScriptProperties().setProperty("SUDOKU_STATUS", "error");
    throw e;
  }
}


/**************************************************
 * ✅ ĐÁP ÁN & GỢI Ý
 **************************************************/

// Điền lời giải Sudoku
function getSudokuSolution() {
  var props = PropertiesService.getScriptProperties();
  var puzzleStr = props.getProperty("SUDOKU_PUZZLE");
  var solutionStr = props.getProperty("SUDOKU_SOLUTION");

  if (!puzzleStr || !solutionStr) throw new Error("❌ Chưa có dữ liệu puzzle/solution!");

  var puzzle = JSON.parse(puzzleStr);
  var solution = JSON.parse(solutionStr);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SUDOKU");
  if (!sheet) throw new Error("❌ Chưa có sheet SUDOKU!");

  var startRow = 4, startCol = 3;

  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cell = sheet.getRange(startRow + r, startCol + c);
      if (puzzle[r][c] !== 0) {
        cell.setValue(puzzle[r][c]).setBackground("#d9d9d9");
      } else {
        cell.setValue(solution[r][c]).setBackground("#fff2cc");
      }
      cell.setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold");
    }
  }
}

// Lấy gợi ý cho 1 ô (row, col)
function getSudokuHintForCell(row, col) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Chưa cấu hình GEMINI_API_KEY trong Script Properties");

  var puzzleStr = PropertiesService.getScriptProperties().getProperty("SUDOKU_PUZZLE");
  if (!puzzleStr) throw new Error("❌ Không tìm thấy puzzle gốc!");
  var puzzle = JSON.parse(puzzleStr);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SUDOKU");
  if (!sheet) throw new Error("❌ Chưa có sheet SUDOKU!");

  var startRow = 4, startCol = 3;
  var current = JSON.parse(JSON.stringify(puzzle));

  // Lấy dữ liệu hiện tại của người chơi
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var val = sheet.getRange(startRow + r, startCol + c).getValue();
      if (puzzle[r][c] === 0 && val) current[r][c] = Number(val);
    }
  }

  if (puzzle[row-1][col-1] !== 0) {
    throw new Error("Ô (" + row + "," + col + ") không phải ô cần giải!");
  }

  var prompt = `
Phân tích Sudoku hiện tại:
${JSON.stringify(current)}

Yêu cầu:
- Xem xét ô tại hàng ${row}, cột ${col}.
- Nếu sai: giải thích & gợi ý đúng.
- Nếu trống: gợi ý số chính xác.
- Trả lời ngắn gọn bằng tiếng Việt.
`;

  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
  var payload = { contents: [{ parts: [{ text: prompt }]}] };

  var res = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  var json = JSON.parse(res.getContentText());
  try {
    return json.candidates[0].content.parts[0].text.trim();
  } catch (e) {
    throw new Error("Không đọc được phản hồi từ Gemini: " + res.getContentText());
  }
}


/**************************************************
 * ✏️ SỰ KIỆN EDIT & KIỂM TRA HOÀN THÀNH
 **************************************************/

function onEdit(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var puzzleStr = props.getProperty("SUDOKU_PUZZLE");
    var solutionStr = props.getProperty("SUDOKU_SOLUTION");
    if (!puzzleStr || !solutionStr) return;

    var puzzle = JSON.parse(puzzleStr);
    var solution = JSON.parse(solutionStr);

    var sheet = e.range.getSheet();
    if (sheet.getName() !== "SUDOKU") return;

    var startRow = 4, startCol = 3;
    var editRow = e.range.getRow(), editCol = e.range.getColumn();

    // Xử lý khóa ô gốc
    for (var i = 0; i < e.range.getNumRows(); i++) {
      for (var j = 0; j < e.range.getNumColumns(); j++) {
        var cell = e.range.getCell(i+1, j+1);
        var pr = editRow + i - startRow;
        var pc = editCol + j - startCol;

        if (pr >= 0 && pr < 9 && pc >= 0 && pc < 9) {
          if (puzzle[pr][pc] !== 0) {
            cell.setValue(puzzle[pr][pc]).setBackground("#d9d9d9");
          } else {
            cell.setBackground(null);
          }
        }
      }
    }

    // Kiểm tra thắng cuộc
    var isComplete = true;
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var val = sheet.getRange(startRow + r, startCol + c).getValue();
        if (Number(val) !== solution[r][c]) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }

    props.setProperty("SUDOKU_STATUS", isComplete ? "win" : "idle");

  } catch (err) {
    Logger.log("onEdit error: " + err);
  }
}
