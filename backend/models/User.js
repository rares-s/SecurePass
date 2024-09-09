const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Schema für die Webseiten-Daten (Link, Passwort, etc.)
const WebsiteDataSchema = new Schema({
  title: { type: String, required: true },  // Name der Webseite
  url: { type: String, required: true },    // URL der Webseite
  password: { type: String, required: false },
  description: { type: String, required: false },  // Gespeichertes Passwort für die Webseite
  timestamp: { type: Date, default: Date.now } // Zeitstempel der Erstellung
});

// Schema für den Benutzer
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true }, // E-Mail für Login
  password: { type: String, required: true }, // Passwort für Login
  websites: [WebsiteDataSchema] // Array von Webseiten-Daten
}, {
  timestamps: true  // Automatische Zeitstempel
});

// Middleware, um das Passwort vor dem Speichern zu hashen
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
