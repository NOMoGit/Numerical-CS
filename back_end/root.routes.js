import { Router } from "express";
import connection from "./DB.js";

const router = Router();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM ROOTOE";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ ok: false, message: "Database query failed" });
    }
    res.json({ results });
  });
});


router.post("/", (req, res) => {
  
  
  const { equation } = req.body;
  
  if (!equation) {
    
    return res.status(400).json({ error: "Equation is required" });
  }
  
  const sql = "INSERT INTO ROOTOE (Equeation) VALUES (?)";
  
  connection.query(sql, [equation], (err, results) => {
    if (err) {
      
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      success: true, 
      message: "บันทึกสมการสำเร็จ", 
      id: results.insertId 
    });
  });
});



// Update สมการ
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { equation } = req.body;

  if (!equation) {
    return res.status(400).json({ error: "Equation is required" });
  }

  const sql = "UPDATE ROOTOE SET Equeation = ? WHERE ID = ?";

  connection.query(sql, [equation, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Equation not found" });
    }

    res.json({ success: true, message: "แก้ไขสมการสำเร็จ" });
  });
});



// Delete สมการ
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM ROOTOE WHERE ID = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Equation not found" });
    }

    res.json({ success: true, message: "ลบสมการสำเร็จ" });
  });
});

export default router;