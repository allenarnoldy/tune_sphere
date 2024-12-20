import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = true; // Mark field as invalid
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Highlight invalid fields
      return;
    }

    try {
      const response = await axios.post("/auth/signup", formData);
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
        setErrors({});
      }
    } catch (error: any) {
      console.error('Error during sign-up:', error);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="container">
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Sign Up</h2>
          {success && <div className="alert alert-success">User registered successfully!</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="user_name" className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.user_name ? 'is-invalid' : ''}`}
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="share_info" className="form-label">Share Information</label>
              <select
                className={`form-select ${errors.share_info ? 'is-invalid' : ''}`}
                id="share_info"
                name="share_info"
                value={formData.share_info}
                onChange={handleChange}
              >
                <option value="">Do you want to share your information?</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </select>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>
          </form>

          <div className="mt-3 text-center">
            <button type="button" className="btn btn-link" onClick={handleLoginRedirect}>
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
