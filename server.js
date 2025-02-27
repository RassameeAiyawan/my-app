const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv'); // สำหรับการโหลดตัวแปร environment (ควรใช้สำหรับการเก็บค่า secret key)
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ให้ Express ให้บริการไฟล์อัปโหลด

// ตั้งค่าการอัปโหลดไฟล์ด้วย multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'mydatabase'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

// API สำหรับการสมัครสมาชิก
app.post('/register', upload.single('profileImage'), async (req, res) => {
  const { name, studentId, branch, faculty, university, gpa, username, email, password } = req.body;

  if (!name || !studentId || !username || !email || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (result.length > 0) {
      return res.status(400).json({ error: 'มีชื่อผู้ใช้งานหรืออีเมลนี้ในระบบแล้ว' });
    }
    const profileImage = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    await db.promise().query(
      'INSERT INTO users (name, studentId, branch, faculty, university, gpa, username, email, password, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, studentId, branch, faculty, university, gpa, username, email, hashedPassword, profileImage]
    );

    res.status(200).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
  }
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

// API สำหรับลบโปรไฟล์

app.delete('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  
  if (!userId) {
    return res.status(400).json({ error: 'ต้องระบุ User ID' });
  }

  // คำสั่ง SQL สำหรับการลบโปรไฟล์
  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบโปรไฟล์' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'ไม่พบโปรไฟล์นี้เพื่อลบ' });
    }

    // ลบไฟล์ภาพโปรไฟล์ถ้ามี
    const profileImage = result[0].profileImage;
    if (profileImage) {
      const imagePath = path.join(__dirname, 'uploads', path.basename(profileImage));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('ไม่สามารถลบรูปโปรไฟล์ได้:', err);
        }
      });
    }

    // ลบข้อมูลโปรไฟล์ในฐานข้อมูล
    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    
    db.query(deleteQuery, [userId], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบโปรไฟล์' });
      }
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'ไม่พบโปรไฟล์นี้เพื่อลบ' });
      }
      res.status(200).json({ message: 'ลบโปรไฟล์สำเร็จ' });
    });
  });
});


// API สำหรับแก้ไขโปรไฟล์
app.put('/profile/:userId', upload.single('profileImage'), async (req, res) => {
  const userId = req.params.userId;
  const { name, studentId, branch, faculty, university, gpa, username, email } = req.body;

  if (!name || !studentId || !username || !email) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
  }

  try {
    // ค้นหาข้อมูลของผู้ใช้ในฐานข้อมูล
    const query = 'SELECT * FROM users WHERE id = ?';
    const [user] = await db.promise().query(query, [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'ไม่พบโปรไฟล์นี้' });
    }

    // หากมีการอัปโหลดไฟล์ภาพโปรไฟล์ใหม่
    let profileImage = user[0].profileImage;
    if (req.file) {
      // ลบไฟล์ภาพเดิมถ้ามี
      const fs = require('fs');
      const path = require('path');
      if (profileImage) {
        const oldImagePath = path.join(__dirname, 'uploads', path.basename(profileImage));
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('ไม่สามารถลบไฟล์รูปภาพเดิมได้:', err);
          }
        });
      }
      // ตั้งค่ารูปภาพใหม่
      profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // อัปเดตข้อมูลโปรไฟล์ในฐานข้อมูล
    const updateQuery = 'UPDATE users SET name = ?, studentId = ?, branch = ?, faculty = ?, university = ?, gpa = ?, username = ?, email = ?, profileImage = ? WHERE id = ?';
    await db.promise().query(updateQuery, [name, studentId, branch, faculty, university, gpa, username, email, profileImage, userId]);

    res.status(200).json({ message: 'โปรไฟล์อัปเดตสำเร็จ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' });
  }
});


// เริ่มต้นเซิร์ฟเวอร์
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
