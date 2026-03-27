const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

// ✅ UPDATED: Get ONLY students enrolled in a specific course
router.get("/teacher/students/:course_id", async (req, res) => {
  let conn;
  try {
    const { course_id } = req.params;
    conn = await oracledb.getConnection({
      user: "project", password: process.env.DB_PASSWORD, connectString: "localhost:1521/XEPDB1",
    });
    // Join with enrollments to filter
    const result = await conn.execute(`
      SELECT s.student_id, u.email
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      JOIN enrollments e ON s.student_id = e.student_id
      WHERE e.course_id = :course_id`, 
      [course_id], 
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
  finally { if (conn) await conn.close(); }
});

// ✅ NEW: Get Ranking & CGPA for a student
router.get("/rank/:student_id", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: "project", password: process.env.DB_PASSWORD, connectString: "localhost:1521/XEPDB1",
    });
    const result = await conn.execute(
      `SELECT * FROM student_rankings WHERE student_id = :id`,
      [req.params.student_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).send(err.message); }
  finally { if (conn) await conn.close(); }
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


// ✅ NEW: Enroll a student into a course
router.post("/teacher/enroll", async (req, res) => {
  let conn;
  try {
    const { student_id, course_id, academic_year } = req.body;
    const oracledb = require("oracledb");

    conn = await oracledb.getConnection({
      user: "project",
      password: process.env.DB_PASSWORD,
      connectString: "localhost:1521/XEPDB1",
    });

    await conn.execute(
      `INSERT INTO enrollments (student_id, course_id, academic_year)
       VALUES (:student_id, :course_id, :year)`,
      { student_id, course_id, year: academic_year || '2026' },
      { autoCommit: true }
    );

    res.json({ message: "Student enrolled successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  } finally {
    if (conn) await conn.close();
  }
});

// ✅ NEW: Get ALL students for the Enrollment dropdown
router.get("/teacher/students", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: "project",
      password: process.env.DB_PASSWORD,
      connectString: "localhost:1521/XEPDB1",
    });

    const result = await conn.execute(
      `SELECT s.student_id, u.email
       FROM students s
       JOIN users u ON s.user_id = u.user_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (conn) await conn.close();
  }
});
module.exports = router;