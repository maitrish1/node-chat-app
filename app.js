const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Handle login and message form
app.post('/', (req, res) => {
  const username = req.body.username;
  const message = req.body.message;
  const filePath = path.join(__dirname, 'messages.txt');

  if (username && message) {
    // Append the new message to the file
    const messageToWrite = `${username}:${message}\n`;
    fs.appendFileSync(filePath, messageToWrite);
  }

  // Read all messages
  let allMessages = '';
  if (fs.existsSync(filePath)) {
    allMessages = fs.readFileSync(filePath, 'utf-8');
  }

  // Send the message form and all messages back to the client
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Messages</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <form action="/" method="POST">
        <input name="message" placeholder="Enter message" type="text" required>
        <button type="submit">Send</button>
        <input type="hidden" name="username" value="${username}">
      </form>
      <p>Messages:</p>
      <p>${allMessages.replace(/\n/g, ', ').slice(0, -2)}</p>
      <nav>
        <a href="/contactus">Contact Us</a>
      </nav>
    </body>
    </html>
  `);
});

// Serve contact us form
app.get('/contactus', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Handle contact form submission
app.post('/contactus', (req, res) => {
  res.redirect('/success');
});

// Serve success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

// Handle 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
