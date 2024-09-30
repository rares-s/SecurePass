const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Dein User-Modell
const { sendEmail } = require('./mailService'); // Import mail service
const jwtSecret = 'deinGeheimesToken';


// Registrierung eines neuen Benutzers (keine authMiddleware hier)
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body; // Benutzer-Eingaben

    try {
      // Prüfe, ob der Benutzer bereits existiert
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Benutzer existiert bereits' });
      }

      // Benutzer erstellen und speichern
      user = new User({ email, password, username });
      await user.save();

               // Send welcome email
               const emailSubject = "Willkommen bei SecurePass!";
               const emailBody = `
                    <h3>Hallo ${username},</h3>
                      <p>Willkommen bei <strong>SecurePass</strong>! Wir freuen uns, dich an Bord zu haben. Mit SecurePass kannst du deine Passwörter sicher verwalten und stets den Überblick behalten. So kannst du loslegen:</p>
                      <ul>
                          <li><strong>Melde dich in deinem Konto an</strong>: Logge dich ein, um direkt auf dein persönliches Dashboard zuzugreifen.</li>
                          <li><strong>Erkunde unsere Funktionen zur Passwortverwaltung</strong>: Sichere deine Anmeldedaten für all deine Konten an einem Ort, erstelle sichere Passwörter mit unserem Passwortgenerator und überprüfe die Stärke deiner bestehenden Passwörter.</li>
                          <li><strong>Sichere Notizen</strong>: Nutze die Funktion für sichere Notizen, um wichtige Informationen zu speichern, die du geschützt aufbewahren möchtest.</li>
                          <li><strong>Passwort-Synchronisation</strong>: Deine Passwörter sind auf all deinen Geräten synchronisiert und sofort einsatzbereit, egal ob du am Computer oder mobil unterwegs bist.</li>
                          
                      </ul>
                      <p><strong>Bleib sicher!</strong></p>
                      <p>Falls du Fragen hast oder Unterstützung benötigst, kannst du jederzeit unser <a href="mailto:support@securepass.com">Support-Team kontaktieren</a>.</p>
                      <p>Beste Grüße,<br>Das SecurePass Team</p>
               `;
       
               sendEmail(email, emailSubject, emailBody);
       

      // JWT Token erstellen
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });


      res.status(201).json({ token, message: 'Benutzer erfolgreich registriert' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Serverfehler');
    }
  });
  
  

// Login eines Benutzers
router.post('/login', async (req, res) => {
    console.log('Received email:', req.body.email);
    console.log('Received password:', req.body.password);
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).json({ message: 'Ungültige Anmeldedaten' });
      }
  
      console.log('User authenticated');
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Serverfehler' });
    }
  });
  
  
  
  
  

module.exports = router;
