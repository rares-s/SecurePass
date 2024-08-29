const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  password: { type: String, required: true },  // Neues Feld für Passwort
  created_at: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Verknüpfung mit User
});

module.exports = mongoose.model('Link', LinkSchema);