const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initPool } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

initPool().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

app.use('/api/auth', require('./routes/auth'));

app.use('/api/grades', require('./routes/grades'));

const teacherRoutes = require("./routes/teacher");
app.use("/api", teacherRoutes);