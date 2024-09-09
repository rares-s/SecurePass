const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Dein User-Modell
const jwtSecret = 'deinGeheimesToken';


// Registrierung eines neuen Benutzers (keine authMiddleware hier)
router.post('/register', async (req, res) => {
    const { email, password } = req.body; // Benutzer-Eingaben

    try {
      // Prüfe, ob der Benutzer bereits existiert
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Benutzer existiert bereits' });
      }

      // Benutzer erstellen und speichern
      user = new User({ email, password });
      await user.save();

      // JWT Token erstellen
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

      res.status(201).json({ token, message: 'Benutzer erfolgreich registriert' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Serverfehler');
    }
  });
  
  

// Login eines Benutzers (keine authMiddleware hier)
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
