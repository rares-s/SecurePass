const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Schema für die Webseiten-Daten (Link, Passwort, etc.)
const WebsiteDataSchema = new Schema({
  title: { type: String, required: true },  // Name der Webseite
  url: { type: String, required: true },    // URL der Webseite
  username: { type: String, required: false},
  password: { type: String, required: false },
  gradient: { type: String, required: false },
  description: { type: String, required: false },  // Gespeichertes Passwort für die Webseite
  category: { type: String, required: true, default: 'Sonstiges'},  // Kategorie
  timestamp: { type: Date, default: Date.now }, // Zeitstempel der Erstellung
  order: { type: Number, default: 0 },
});

// Schema für den Benutzer
const UserSchema = new Schema({
  username: { type: String, required: true }, //Username
  email: { type: String, required: true, unique: true }, // E-Mail für Login
  password: { type: String, required: true }, // Passwort für Login
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
