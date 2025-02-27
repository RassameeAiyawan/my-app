const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');  // เพิ่ม bcrypt สำหรับการเข้ารหัสรหัสผ่าน
const app = express();

app.use(cors());  // เปิดให้สามารถเข้าถึงจากภายนอก
app.use(express.json());  // ให้สามารถรับข้อมูลเป็น JSON

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // เปลี่ยนเป็นข้อมูลของคุณ
  password: '12345678',  // รหัสผ่านของ MySQL
  database: 'mydatabase'  // ชื่อฐานข้อมูลของคุณ
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

// API สำหรับการสมัครสมาชิก
app.post('/register', async (req, res) => {
  const { name, studentId, branch, faculty, university, gpa, username, email, password } = req.body;

  // การตรวจสอบข้อมูลพื้นฐาน (ให้แน่ใจว่าไม่มีข้อมูลที่เป็นค่าว่าง)
  if (!name || !studentId || !username || !email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
  }

  // การเข้ารหัสรหัสผ่านก่อนที่จะบันทึก
  const hashedPassword = await bcrypt.hash(password, 10);

  // ตรวจสอบว่า username หรือ email มีอยู่แล้วหรือไม่
  const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkQuery, [username, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลผู้ใช้' });
    }
    if (result.length > 0) {
      return res.status(400).json({ error: 'มีชื่อผู้ใช้งานหรืออีเมลนี้ในระบบแล้ว' });
    }

    // หากไม่มี username หรือ email ซ้ำ ให้ทำการบันทึกข้อมูลผู้ใช้
    const query = 'INSERT INTO users (name, studentId, branch, faculty, university, gpa, username, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, studentId, branch, faculty, university, gpa, username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
      }
      res.status(200).json({ message: 'สมัครสมาชิกสำเร็จ' });
    });
  });
});

// API สำหรับการล็อกอิน
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบข้อมูลที่ป้อนเข้ามา
  if (!username || !password) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน' });
  }

  // ตรวจสอบว่า user มีอยู่ในฐานข้อมูลหรือไม่
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: 'ข้อมูลไม่ถูกต้อง' });
    }

    // ตรวจสอบรหัสผ่านที่ถูกเข้ารหัส
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'ข้อมูลไม่ถูกต้อง' });
    }

    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', user: user });
  });
});

// API สำหรับดึงข้อมูลโปรไฟล์
app.get('/profile', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'ต้องระบุ User ID' });
  }

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'ไม่พบโปรไฟล์นี้' });
    }
    res.status(200).json({ profile: result[0] });
  });
});



// เริ่มต้นเซิร์ฟเวอร์
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
