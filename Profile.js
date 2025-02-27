import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Profile() {
  const { state } = useLocation();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profile', { params: { userId: state.userId } });
        setProfile(response.data.profile);
        setUpdatedProfile(response.data.profile); // Set the initial state for updating
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to fetch profile');
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
    try {
      const response = await axios.put('http://localhost:5000/profile', updatedProfile);
      setProfile(response.data.profile);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="container mt-4">
      {profile ? (
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h2>Profile Information</h2>
            <button
              className="btn btn-secondary"
              onClick={handleEditClick}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="card-body">
            <h4 className="card-title">{profile.name}</h4>
            <div className="form-group">
              <strong>Username:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={updatedProfile.username}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.username}</p>
              )}
            </div>
            <div className="form-group">
              <strong>Student ID:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="studentId"
                  value={updatedProfile.studentId}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.studentId}</p>
              )}
            </div>
            <div className="form-group">
              <strong>Branch:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="branch"
                  value={updatedProfile.branch}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.branch}</p>
              )}
            </div>
            <div className="form-group">
              <strong>Faculty:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="faculty"
                  value={updatedProfile.faculty}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.faculty}</p>
              )}
            </div>
            <div className="form-group">
              <strong>University:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="university"
                  value={updatedProfile.university}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.university}</p>
              )}
            </div>
            <div className="form-group">
              <strong>GPA:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="gpa"
                  value={updatedProfile.gpa}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.gpa}</p>
              )}
            </div>
            <div className="form-group">
              <strong>Email:</strong>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedProfile.email}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <p className="card-text">{profile.email}</p>
              )}
            </div>

            {isEditing && (
              <button className="btn btn-primary" onClick={handleUpdateProfile}>
                Save Changes
              </button>
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
