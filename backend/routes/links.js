// routes/links.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

// Alle Kacheln des angemeldeten Benutzers abrufen und nach 'order' sortieren
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Webseiten nach 'order' sortieren
    user.websites.sort((a, b) => a.order - b.order);
    res.json(user.websites);
  } catch (error) {
    console.error('Server error while fetching websites:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Neue Kachel erstellen
router.post('/', authMiddleware, async (req, res) => {
  const { title, url, password, gradient, description, username, category } = req.body;

  // Füge eine Validierung der Anfrage hinzu
  if (!title || !url || !password || !category) {
    return res.status(400).json({ message: 'Title, URL, Password, and Category are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Bestimme den höchsten aktuellen `order` Wert
    const maxOrder = user.websites.reduce((max, website) => Math.max(max, website.order || 0), 0);

    const newWebsite = {
      title,
      url,
      password,
      gradient,
      description,
      username,
      category,
      order: maxOrder + 1 // Setze den `order` Wert auf den höchsten Wert + 1
    };

    user.websites.push(newWebsite);
    await user.save();
    res.status(201).json(newWebsite);
  } catch (error) {
    console.error('Server error while creating a new website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Kachel löschen
router.delete('/:websiteId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Entferne die Webseite anhand der ID
    user.websites.id(req.params.websiteId).remove();
    await user.save();

    res.json({ message: 'Website removed' });
  } catch (error) {
    console.error('Server error while deleting website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route zum Aktualisieren einer spezifischen Website
router.put('/:websiteId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const website = user.websites.id(req.params.websiteId);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    website.password = req.body.password || website.password;
    website.username = req.body.username !== undefined ? req.body.username : website.username;
    website.description = req.body.description !== undefined ? req.body.description : website.description;
    website.category = req.body.category !== undefined ? req.body.category : website.category;

    if (req.body.order !== undefined) {
      website.order = req.body.order;
    }

    await user.save();

    res.json(website);
  } catch (error) {
    console.error('Server error while updating website:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route zum Aktualisieren der Reihenfolge der Websites
router.post('/updateOrder', authMiddleware, async (req, res) => {
  try {
    const { orderData } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    orderData.forEach(orderItem => {
      const website = user.websites.id(orderItem._id);
      if (website) {
        website.order = orderItem.order;
      }
    });

    await user.save();
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating website order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
