const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// ✅ GET STUDENTS
router.get("/teacher/students", async (req, res) => {
  let conn;

  try {
    conn = await oracledb.getConnection({
      user: "project",
      password: process.env.DB_PASSWORD,
      connectString: "localhost:1521/XEPDB1",
    });

    const result = await conn.execute(`
      SELECT s.student_id, u.email
      FROM students s
      JOIN users u ON s.user_id = u.user_id
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("Error fetching students");

  } finally {
    if (conn) await conn.close();
  }
});

router.get("/teacher/exams/:course_id", async (req, res) => {
  let conn;

  try {
    const oracledb = require("oracledb");
    const { course_id } = req.params;

    conn = await oracledb.getConnection({
      user: "project",
      password: process.env.DB_PASSWORD,
      connectString: "localhost:1521/XEPDB1",
    });

    const result = await conn.execute(
      `SELECT exam_id, exam_name 
       FROM exams 
       WHERE course_id = :course_id`,
      [course_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error("EXAM ERROR:", err);
    res.status(500).send(err.message);

  } finally {
    if (conn) await conn.close();
  }
});

router.get("/teacher/courses", async (req, res) => {
  let conn;

  try {
    const oracledb = require("oracledb");

    conn = await oracledb.getConnection({
      user: "project",
      password: process.env.DB_PASSWORD,
      connectString: "localhost:1521/XEPDB1",
    });

    const result = await conn.execute(
      `SELECT course_id, course_name FROM courses`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error("COURSE ERROR:", err);
    res.status(500).send(err.message);

  } finally {
    if (conn) await conn.close();
  }
});


// ✅ GET ALL EXAMS (for initial load)
router.get("/teacher/exams", async (req, res) => {
  let conn;

  try {
    const oracledb = require("oracledb");

    conn = await oracledb.getConnection({
      user: "project",
      password: process.env.DB_PASSWORD,
      connectString: "localhost:1521/XEPDB1",
    });

    const result = await conn.execute(
      `SELECT exam_id, exam_name, course_id FROM exams`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error("EXAMS ERROR:", err);
    res.status(500).send(err.message);

  } finally {
    if (conn) await conn.close();
  }
});
module.exports = router;