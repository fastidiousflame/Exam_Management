const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initPool } = require('./config/db');

const authRoutes = require('./routes/auth');
const gradeRoutes = require('./routes/grades');
const teacherRoutes = require("./routes/teacher");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- FIXED MOUNTING ---

// 1. Auth Routes (Login/Register)
// This makes the routes: /api/auth/login and /api/auth/register
app.use('/api/auth', authRoutes);

// 2. Grade Routes
app.use('/api/grades', gradeRoutes);

// 3. Teacher Routes 
// Since your teacher.js has paths starting with "/teacher/...", 
// mounting at "/api" makes them "/api/teacher/..."
app.use("/api", teacherRoutes); 

const PORT = process.env.PORT || 5000;

initPool().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});