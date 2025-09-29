function helloWorldGemini() {
  var apiKey = "YOUR_API_KEY"; // thay bằng API key thật
  var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

  var payload = {
    contents: [{
      parts: [{ text: "Say Hello World!" }]
    }]
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  Logger.log(json.candidates[0].content.parts[0].text);
}
