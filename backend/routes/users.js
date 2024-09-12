const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Alle Benutzer abrufen
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Neuen Benutzer hinzufügen
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE: Benutzer löschen
router.delete('/:id', async (req, res) => {
    try {
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Attempt to delete the user
        const result = await User.deleteOne({ _id: req.params.id });

        // Check if a document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with success
        res.json({ message: 'User deleted' });
    } catch (err) {
        // Log and respond with error
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});
module.exports = router;