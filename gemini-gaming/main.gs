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
  var puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SUKOKU");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("SUKOKU");
  }

  var startRow = 4;
  var startCol = 3;

  // Vẽ Sudoku
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cell = sheet.getRange(startRow + r, startCol + c);
      if (puzzle[r][c] !== 0) {
        cell.setValue(puzzle[r][c]);
        cell.setBackground("#d9d9d9"); // ô có số: tô xám
      } else {
        cell.setValue("");
        cell.setBackground(null); // ô trống
      }
      cell.setHorizontalAlignment("center");
      cell.setVerticalAlignment("middle");
      cell.setFontWeight("bold");
    }
  }

  // chỉnh kích thước ô
  sheet.setColumnWidths(startCol, 9, 30);
  sheet.setRowHeights(startRow, 9, 30);

  // Xóa viền cũ
  sheet.getRange(startRow, startCol, 9, 9).setBorder(false, false, false, false, false, false);

  // Tạo viền cho toàn bảng
  sheet.getRange(startRow, startCol, 9, 9).setBorder(true, true, true, true, true, true);

  // Viền dày cho các khối 3x3
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var r = startRow + i*3;
      var c = startCol + j*3;
      sheet.getRange(r, c, 3, 3)
          .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    }
  }

  // Viền ngoài cùng đậm (không cần nếu trên đã set đủ)
  sheet.getRange(startRow, startCol, 9, 9)
      .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
}