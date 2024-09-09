// routes/tiles.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

// Alle Kacheln des angemeldeten Benutzers abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Verwende "id" und nicht "userId"
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.websites); // Gebe die Webseiten des Benutzers zurück
  } catch (error) {
    console.error('Server error while fetching websites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Neue Kachel erstellen
router.post('/', authMiddleware, async (req, res) => {
  const { title, url, password, description } = req.body;

  // Füge eine Validierung der Anfrage hinzu
  if (!title || !url || !password ) {
    return res.status(400).json({ message: 'Title and URL are required' });
  }

  try {
    console.log('Received body:', req.body);
    const user = await User.findById(req.user.id);
    console.log('User found:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newWebsite = { title, url, password, description }; // Verwende "websites" statt "tiles"
    user.websites.push(newWebsite);  // Füge die neue Webseite zu "websites" hinzu
    await user.save();
    res.status(201).json(newWebsite);  // Gib die neu erstellte Webseite zurück
  } catch (error) {
    console.error('Server error while creating a new website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Kachel löschen
router.delete('/:websiteId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Stelle sicher, dass du `id` verwendest und nicht `userId`
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filtere die Webseite, die gelöscht werden soll
    user.websites = user.websites.filter(website => website._id.toString() !== req.params.websiteId);
    await user.save();

    res.json({ message: 'Website removed' });
  } catch (error) {
    console.error('Server error while deleting website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
