// Frontend
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


// Backend