import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Profile.css'; // import custom CSS file

function Profile() {
  const { state } = useLocation();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile', { params: { userId: state.userId } });
        setProfile(response.data.profile);
        setUpdatedProfile(response.data.profile);
      } catch (error) {
        alert(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้');
      }
    };

    fetchProfile();
  }, [state.userId]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    // เพิ่มข้อมูลทั้งหมดลงใน FormData
    for (const key in updatedProfile) {
      formData.append(key, updatedProfile[key]);
    }

    try {
      const response = await axios.put('http://localhost:5000/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(response.data.profile);
      setIsEditing(false);
      alert('อัพเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
    } catch (error) {
      alert(error.response?.data?.message || 'ไม่สามารถอัพเดตข้อมูลโปรไฟล์ได้');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์? การกระทำนี้ไม่สามารถย้อนกลับได้!');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/profile/${state.userId}`);
        localStorage.removeItem('userToken');
        navigate('/login');
      } catch (error) {
        alert(error.response?.data?.message || 'ไม่สามารถลบโปรไฟล์ได้');
      }
    }
  };

  return (
    <div className="container mt-5">
      {profile ? (
        <div className="card shadow-lg rounded-lg">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2>ข้อมูลส่วนตัว</h2>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-warning profile-btn" onClick={handleEditClick}>
                {isEditing ? 'ยกเลิก' : 'แก้ไข'}
              </button>
              <button className="btn btn-danger ms-2 profile-btn" onClick={handleDeleteProfile}>
                ลบโปรไฟล์
              </button>
              <button className="btn btn-success ms-2 profile-btn" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-center mb-3">
              <p className="card-text">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="img-fluid rounded-circle profile-image"
                  />
                ) : (
                  <span>ไม่มีรูปโปรไฟล์</span>
                )}
              </p>
            </div>
            <h4 className="card-title text-center mb-4">{profile.username}</h4>
            <div className="form-group">
              <strong>ชื่อ-นามสกุล:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={updatedProfile.name}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.name}</p>
              )}
            </div>
            <div className="form-group">
              <strong>รหัสนักศึกษา:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="studentId"
                  value={updatedProfile.studentId}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.studentId}</p>
              )}
            </div>
            <div className="form-group">
              <strong>สาขา:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="branch"
                  value={updatedProfile.branch}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.branch}</p>
              )}
            </div>
            <div className="form-group">
              <strong>คณะ:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="faculty"
                  value={updatedProfile.faculty}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.faculty}</p>
              )}
            </div>
            <div className="form-group">
              <strong>มหาวิทยาลัย:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="university"
                  value={updatedProfile.university}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.university}</p>
              )}
            </div>
            <div className="form-group">
              <strong>เกรดเฉลี่ย:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="gpa"
                  value={updatedProfile.gpa}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.gpa}</p>
              )}
            </div>
            <div className="form-group">
              <strong>อีเมล:</strong>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedProfile.email}
                  onChange={handleChange}
                  className="form-control form-input"
                />
              ) : (
                <p className="card-text">{profile.email}</p>
              )}
            </div>

            {isEditing && (
              <div className="text-center mt-4">
                <button className="btn btn-success profile-btn" onClick={handleUpdateProfile}>
                  บันทึกการเปลี่ยนแปลง
                </button>   
              </div>             
            )}
            
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
