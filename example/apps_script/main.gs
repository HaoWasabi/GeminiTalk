function callGemini() {
  const apiKey = "YOUR_API_KEY";
  const url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey;

  const payload = {
    contents: [{ parts: [{ text: "Giới thiệu ngắn về Gemini API" }] }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}
