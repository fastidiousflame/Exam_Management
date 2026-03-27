const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { getConnection } = require('../config/db');
require('dotenv').config();

// ==========================================
// 1. REGISTER ROUTE (Missing in your file!)
// ==========================================
router.post('/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  let conn;

  try {
    conn = await getConnection();
    const hashed = await bcrypt.hash(password, 10);

    // Insert into USERS table
    await conn.execute(
      `INSERT INTO users (email, password, full_name, role)
       VALUES (:u_email, :u_pass, :u_name, :u_role)`,
      { 
        u_email: email, 
        u_pass: hashed, 
        u_name: full_name, 
        u_role: role 
      },
      { autoCommit: true }
    );

    // Retrieve the newly created USER_ID
    const userRes = await conn.execute(
      `SELECT user_id FROM users WHERE email = :u_email`,
      { u_email: email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const newUserId = userRes.rows[0].USER_ID;

    // Automated student profile creation if role is student
    if (role === 'student') {
      const deptRes = await conn.execute(
        `SELECT dept_id FROM departments WHERE dept_code = 'CS'`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const deptId = deptRes.rows[0].DEPT_ID;
      const uniqueRoll = 'S' + Date.now().toString().slice(-6);

      await conn.execute(
        `INSERT INTO students (user_id, roll_number, dept_id, semester)
         VALUES (:s_uid, :s_roll, :s_did, 1)`, 
        { 
          s_uid: newUserId, 
          s_roll: uniqueRoll, 
          s_did: deptId 
        },
        { autoCommit: true }
      );
    }

    res.json({ message: 'Registration Successful' });

  } catch (err) {
    console.error("REGISTRATION ERROR:", err.message);
    res.status(500).json({ message: "Registration failed", error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ==========================================
// 2. LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let conn;

  try {
    conn = await getConnection();
    
    console.log("--- Login Attempt ---");
    console.log("Email:", email);

    const result = await conn.execute(
     `SELECT u.*, s.student_id, t.teacher_id
      FROM users u
      LEFT JOIN students s ON u.user_id = s.user_id
      LEFT JOIN teachers t ON u.user_id = t.user_id
      WHERE u.email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      console.log("Result: User not found in database.");
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    
    console.log("Password Match Status:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.USER_ID, role: user.ROLE },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log("Login Successful for:", user.FULL_NAME);

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
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;