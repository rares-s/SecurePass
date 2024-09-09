const express = require('express');
const mongoose = require('mongoose');
const linkRoutes = require('./routes/links');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // <-- Auth Routes importieren
const linkRoutes = require('./routes/links'); // <-- Links Routes importieren

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB Verbindung
mongoose.connect('mongodb+srv://raressimoiu:3FS8jGZI9uy4fDmX@cluster0.5qimy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes verwenden
app.use('/api/links', linkRoutes);

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
