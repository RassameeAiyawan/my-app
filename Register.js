import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [branch, setBranch] = useState('');
  const [faculty, setFaculty] = useState('');
  const [university, setUniversity] = useState('');
  const [gpa, setGpa] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
    if (file && file.type.startsWith('image/')) {
      if (file.size > 2 * 1024 * 1024) { // จำกัดขนาดไม่เกิน 2MB
        alert('ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // แสดงตัวอย่างรูป
    } else {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
    }
  };

  const validateForm = () => {
    return (
      name &&
      studentId &&
      branch &&
      faculty &&
      university &&
      gpa &&
      username &&
      email &&
      password
    );
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('studentId', studentId);
    formData.append('branch', branch);
    formData.append('faculty', faculty);
    formData.append('university', university);
    formData.append('gpa', gpa);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (image) {
      formData.append('profileImage', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      window.location.href = '/login';
    } catch (error) {
      alert(error.response?.data?.error || 'การสมัครสมาชิกล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">สมัครสมาชิก</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-group text-center">
            <label htmlFor="profileImage">รูปภาพโปรไฟล์</label>
            <input
              type="file"
              className="form-control"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Profile Preview" className="img-thumbnail" width="150" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">ชื่อ</label>
            <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="studentId">รหัสนักศึกษา</label>
            <input type="text" className="form-control" id="studentId" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="branch">สาขา</label>
            <input type="text" className="form-control" id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="faculty">คณะ</label>
            <input type="text" className="form-control" id="faculty" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="university">มหาวิทยาลัย</label>
            <input type="text" className="form-control" id="university" value={university} onChange={(e) => setUniversity(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="gpa">เกรดเฉลี่ย</label>
            <input type="text" className="form-control" id="gpa" value={gpa} onChange={(e) => setGpa(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button onClick={handleRegister} className="btn btn-primary w-50" disabled={loading}>
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
            </button>
          </div>
          <div className="mt-3 text-center">
            <a href="/login" className="text-decoration-none">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
