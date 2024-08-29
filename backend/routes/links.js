const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

// Alle Links des angemeldeten Benutzers abrufen
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('links');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.links);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Neuen Link erstellen und mit dem Benutzerprofil verknüpfen
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, url } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newLink = new Link({ title, url });
    await newLink.save();

    user.links.push(newLink._id);
    await user.save();

    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Link löschen
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.links.pull(req.params.id);
    await user.save();

    await Link.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
