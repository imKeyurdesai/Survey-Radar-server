require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route files
const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const workerRoutes = require('./src/routes/workerRoutes');
const surveyRoutes = require('./src/routes/surveyRoutes');
const deviceRoutes = require('./src/routes/deviceRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/device', deviceRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Survey Radar API is running...');
});

const errorHandler = require('./src/middlewares/errorMiddleware');

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
