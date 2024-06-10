const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  res.send(`
    <form action="/" method="POST">
      <input name="username" placeholder="Username" type="text" required/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post("/", (req, res) => {
  const username = req.body.username;
  const message = req.body.message;
  const filePath = path.join(__dirname, "messages.txt");

  if (username && message) {
    const messageToWrite = `${username}:${message}\n`;
    fs.appendFileSync(filePath, messageToWrite);
  }

  let allMessages = "";
  if (fs.existsSync(filePath)) {
    allMessages = fs.readFileSync(filePath, "utf-8");
  }

  res.send(`
    <form action="/" method="POST">
      <input name="message" placeholder="Enter message" type="text" required/>
      <button type="submit">Send</button>
      <input type="hidden" name="username" value="${username}"/>
    </form>
    <p>Messages:</p>
    <p>${allMessages.replace(/\n/g, ', ').slice(0, -2)}</p>
  `);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
