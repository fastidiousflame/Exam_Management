const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const auth = require('../middleware/auth');
const { getConnection } = require('../config/db');

// GET student grades
router.get('/student/:id', auth(['student','teacher','admin']), async (req, res) => {
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT g.grade_id, g.marks_obtained, g.grade_letter,
              e.exam_name, c.course_name
       FROM grades g
       JOIN exams e ON g.exam_id = e.exam_id
       JOIN courses c ON e.course_id = c.course_id
       WHERE g.student_id = :id`,
      { id: req.params.id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("GRADES RAW DATA:", JSON.stringify(result.rows));
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ADD or UPDATE grade
router.post('/', auth(['teacher','admin']), async (req, res) => {
  const { student_id, exam_id, marks_obtained, grade_letter } = req.body;
  let conn;

  try {
    conn = await getConnection();

    console.log(`Attempting update: Student ${student_id}, Exam ${exam_id}, Marks ${marks_obtained}, Grade ${grade_letter}`);

    // FIX: Oracle node-oracledb does not allow reusing the same bind variable
    // name multiple times in one statement. Use sid1/sid2, eid1/eid2, m1/m2, gl1/gl2.
    await conn.execute(
      `MERGE INTO grades g
       USING dual
       ON (g.student_id = TO_NUMBER(:sid1) AND g.exam_id = TO_NUMBER(:eid1))
       WHEN MATCHED THEN
         UPDATE SET marks_obtained = TO_NUMBER(:m1),
                    grade_letter = :gl1,
                    graded_at = SYSDATE
       WHEN NOT MATCHED THEN
         INSERT (student_id, exam_id, marks_obtained, grade_letter)
         VALUES (TO_NUMBER(:sid2), TO_NUMBER(:eid2), TO_NUMBER(:m2), :gl2)`,
      {
        sid1: student_id,
        eid1: exam_id,
        m1:   marks_obtained,
        gl1:  grade_letter,
        sid2: student_id,
        eid2: exam_id,
        m2:   marks_obtained,
        gl2:  grade_letter
      },
      { autoCommit: true }
    );

    console.log(`Grade saved: Student ${student_id}, Exam ${exam_id}, Grade ${grade_letter}`);
    res.json({ message: 'Database updated and committed successfully!' });

  } catch (err) {
    console.error("ORACLE DATABASE ERROR:", err.message);
    res.status(500).json({ message: "DB Error: " + err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;