const express = require('express');
const crypto = require('crypto');  // Für Token-Erstellung
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendEmail } = require('./mailService');  // Email-Funktionalität
const router = express.Router();

// Passwort zurücksetzen anfordern
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Benutzer nicht gefunden' });
        }

        // Token und Ablaufzeit generieren
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;  // Token 1 Stunde gültig

        // Token und Ablaufzeit im Benutzer speichern
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Email mit dem Zurücksetzungslink versenden
        const resetLink = `http://localhost:4200/reset-password/${resetToken}`;
        const subject = "Passwort zurücksetzen";
        const emailBody = `
          <p>Hallo,</p>
          <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
          <a href="${resetLink}">Passwort zurücksetzen</a>
          <p>Wenn du dies nicht angefordert hast, ignoriere bitte diese E-Mail.</p>
        `;
        await sendEmail(email, subject, emailBody);
        
        res.status(200).json({ message: 'Passwort-Reset-E-Mail gesendet' });

    } catch (error) {
        console.error('Fehler beim Anfordern des Passwort-Resets:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

// Passwort zurücksetzen
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Überprüfen, ob der Token noch gültig ist
        });

        if (!user) {
            return res.status(400).json({ message: 'Ungültiger oder abgelaufener Token' });
        }

        if (!newPassword || newPassword.trim() === '') {
            return res.status(400).json({ message: 'Das Passwort darf nicht leer sein' });
        }

        // Setze das neue Passwort und entferne das Token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Passwort erfolgreich zurückgesetzt' });
    } catch (error) {
        console.error('Fehler beim Zurücksetzen des Passworts:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

module.exports = router;
