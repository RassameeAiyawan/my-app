import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileEditPage = ({ userId }) => {
  const [profile, setProfile] = useState({
    name: '',
    studentId: '',
    branch: '',
    faculty: '',
    university: '',
    gpa: '',
    username: '',
    email: '',
    profileImage: null,
  });
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  // ดึงข้อมูลโปรไฟล์ปัจจุบันเมื่อโหลดหน้า
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile?userId=${userId}`);
        setProfile(response.data.profile);
        setUpdatedProfile(response.data.profile);
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลโปรไฟล์ได้', error);
      }
    };
    fetchProfile();
  }, [userId]);

  // ฟังก์ชันการแก้ไขข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  // ฟังก์ชันการเลือกไฟล์โปรไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedProfile({
      ...updatedProfile,
      profileImage: file,
    });
  };

  // ฟังก์ชันการอัปเดตโปรไฟล์
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // เพิ่มข้อมูลที่อัปเดตใน formData
    formData.append('name', updatedProfile.name);
    formData.append('studentId', updatedProfile.studentId);
    formData.append('branch', updatedProfile.branch);
    formData.append('faculty', updatedProfile.faculty);
    formData.append('university', updatedProfile.university);
    formData.append('gpa', updatedProfile.gpa);
    formData.append('username', updatedProfile.username);
    formData.append('email', updatedProfile.email);

    // ถ้ามีไฟล์ภาพใหม่
    if (updatedProfile.profileImage) {
      formData.append('profileImage', updatedProfile.profileImage);
    }

    try {
      const response = await axios.put(`http://localhost:5000/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('โปรไฟล์อัปเดตสำเร็จ');
      setProfile(updatedProfile); // อัปเดตข้อมูลโปรไฟล์ใน state
    } catch (error) {
      alert(error.response?.data?.message || 'ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
  };

  return (
    <div className="profile-edit-container">
      <h2>แก้ไขโปรไฟล์</h2>
      <form onSubmit={handleUpdateProfile}>
        {/* ฟอร์มต่าง ๆ สำหรับแก้ไขข้อมูล */}
        <div className="form-group">
          <label>ชื่อ:</label>
          <input
            type="text"
            name="name"
            value={updatedProfile.name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* การแสดงภาพโปรไฟล์เก่า หรือใหม่ */}
        <div className="form-group">
          <label>รูปโปรไฟล์:</label>
          {profile.profileImage ? (
            <div>
              <img
                src={profile.profileImage}
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <p>รูปโปรไฟล์ปัจจุบัน</p>
            </div>
          ) : (
            <p>ไม่มีรูปโปรไฟล์</p>
          )}
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          อัปเดตโปรไฟล์
        </button>
      </form>
    </div>
  );
};

export default ProfileEditPage;
