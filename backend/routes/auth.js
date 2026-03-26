const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { getConnection } = require('../config/db');
require('dotenv').config();

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const hashed = await bcrypt.hash(password, 10);

    await conn.execute(
      `INSERT INTO users (email, password, full_name, role)
       VALUES (:email, :password, :full_name, :role)`,
      { email, password: hashed, full_name, role },
      { autoCommit: true }
    );

    res.json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let conn;

  try {
    conn = await getConnection();
    const result = await conn.execute(
     `SELECT u.*, s.student_id, t.teacher_id
     FROM users u
     LEFT JOIN students s ON u.user_id = s.user_id
     LEFT JOIN teachers t ON u.user_id = t.user_id
     WHERE u.email = :email`,
    { email }
);

    if (!result.rows.length)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.PASSWORD);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user.USER_ID,
        role: user.ROLE
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.USER_ID,
        name: user.FULL_NAME,
        role: user.ROLE,
        student_id: user.STUDENT_ID,
        teacher_id: user.TEACHER_ID
     }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;