const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const challengeRoutes = require('./routes/challenges');
const progressRoutes = require('./routes/progress');
const rankingRoutes = require('./routes/ranking');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/challenges/ranking', rankingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'FitQuest API running' });
});

app.use(errorHandler);

module.exports = app;
