import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    email: '',
    name: '',
    dob: '',
    gender: '',
    share_info: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/api/users/signup', formData);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          user_name: '',
          password: '',
          email: '',
          name: '',
          dob: '',
          gender: '',
          share_info: '',
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/'); // Navigate to the login page when clicked
  };

  return (
    <div
      className="d-flex justify-content-center align-center"
      style={{ minHeight: '100vh' }} // Ensure the container takes full viewport height
    >
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">User registered successfully!</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="user_name" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="share_info" className="form-label">Share Information</label>
              <select
                className="form-select"
                id="share_info"
                name="share_info"
                value={formData.share_info}
                onChange={handleChange}
                required
              >
                <option value="">Do you want to share your information?</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary w-100 mb-3">Sign Up</button>
            </div>
          </form>
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-link w-100 text-center"
              onClick={handleLoginRedirect}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
