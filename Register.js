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

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', { name, studentId, branch, faculty, university, gpa, username, email, password });
      alert(response.data.message);
      // After registration, redirect to login page
      window.location.href = '/login'; // สามารถเปลี่ยนไปใช้ navigate ถ้าคุณใช้ react-router
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">สมัครสมาชิก</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="name">ชื่อ</label>
            <input 
              type="text" 
              className="form-control" 
              id="name" 
              placeholder="กรุณากรอกชื่อ" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentId">รหัสนักศึกษา</label>
            <input 
              type="text" 
              className="form-control" 
              id="studentId" 
              placeholder="กรุณากรอกรหัสนักศึกษา" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="branch">สาขา</label>
            <input 
              type="text" 
              className="form-control" 
              id="branch" 
              placeholder="กรุณากรอกสาขา" 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="faculty">คณะ</label>
            <input 
              type="text" 
              className="form-control" 
              id="faculty" 
              placeholder="กรุณากรอกคณะ" 
              value={faculty} 
              onChange={(e) => setFaculty(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="university">มหาวิทยาลัย</label>
            <input 
              type="text" 
              className="form-control" 
              id="university" 
              placeholder="กรุณากรอกมหาวิทยาลัย" 
              value={university} 
              onChange={(e) => setUniversity(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="gpa">เกรดเฉลี่ย</label>
            <input 
              type="text" 
              className="form-control" 
              id="gpa" 
              placeholder="กรุณากรอกเกรดเฉลี่ย" 
              value={gpa} 
              onChange={(e) => setGpa(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">ชื่อผู้ใช้</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="กรุณากรอกชื่อผู้ใช้" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="กรุณากรอกอีเมล" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="กรุณากรอกรหัสผ่าน" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button onClick={handleRegister} className="btn btn-primary w-50">
            เข้าสู่ระบบ
            </button>
          </div>

          <div className="mt-3 text-center">
            <a href="/login" className="text-decoration-none">มีบัญชีอยู่แล้วใช่ไหม? เข้าสู่ระบบที่นี่</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
