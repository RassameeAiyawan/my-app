import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      alert(response.data.message);
      navigate('/profile', { state: { userId: response.data.user.id } }); // ใช้ navigate ไปหน้าโปรไฟล์
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
      <div className="card-header bg-primary text-white d-flex justify-content-center">
        <h4 className="mb-0">เข้าสู่ระบบ</h4>
      </div>

        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">ชื่อผู้ใช้</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="กรุณากรอกชื่อผู้ใช้งาน"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="กรุณากรอกรหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleLogin} className="btn btn-primary w-100">เข้าสู่ระบบ</button>
          <div className="mt-3 text-center">
            <a href="/register" className="text-decoration-none">สมัครสมาชิก</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
