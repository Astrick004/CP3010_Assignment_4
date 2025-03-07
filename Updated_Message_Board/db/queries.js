const pool = require("./pool");

// Get all messages
async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages ORDER BY added DESC");
  return rows;
}

// Get a message by ID
async function getMessageById(id) {
  const numId = parseInt(id, 10);
  const { rows } = await pool.query("SELECT * FROM messages WHERE Message_ID = $1", [numId]);
  return rows[0];
}

// Insert a new message into the table
async function insertMessage(username, messageText) {
  const query = `
    INSERT INTO messages (username, message_text)
    VALUES ($1, $2) RETURNING *;
  `;
  const values = [username, messageText];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports = {
  getAllMessages,
  getMessageById,
  insertMessage
};
