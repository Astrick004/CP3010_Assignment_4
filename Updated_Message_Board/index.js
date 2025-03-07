const express = require("express");
const path = require("path");
const dbQueries = require("./db/queries");
const app = express();

// Set EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const messageId = req.query.messageId;
  
  if (messageId !== undefined) {
    const message = await dbQueries.getMessageById(messageId);
    res.render("index", { title: "Mini Messageboard", messages: [message], isDetailPage: true });
  } else {
    const messages = await dbQueries.getAllMessages();
    res.render("index", { title: "Mini Messageboard", messages: messages, isDetailPage: false });
  }
});

// Show new message form
app.get("/new", (req, res) => {
  res.render("form");
});

// Handle new message form submission
app.post("/new", async (req, res) => {
  const { user, text } = req.body;
  await dbQueries.insertMessage(user, text);
  res.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
