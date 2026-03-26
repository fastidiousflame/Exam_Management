const express = require('express');
const router = express.Router();
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
      { id: req.params.id }
    );

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

    await conn.execute(
      `MERGE INTO grades g
       USING dual
       ON (g.student_id = :sid AND g.exam_id = :eid)
       WHEN MATCHED THEN
         UPDATE SET marks_obtained = :marks, grade_letter = :grade
       WHEN NOT MATCHED THEN
         INSERT (student_id, exam_id, marks_obtained, grade_letter)
         VALUES (:sid, :eid, :marks, :grade)`,
      {
        sid: student_id,
        eid: exam_id,
        marks: marks_obtained,
        grade: grade_letter
      },
      { autoCommit: true }
    );

    res.json({ message: 'Grade saved successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;