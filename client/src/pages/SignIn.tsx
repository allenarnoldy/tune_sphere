import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.username) newErrors.username = true;
    if (!formData.password) newErrors.password = true;
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('/api/users/login', formData);
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        // Redirect to the dashboard or home page upon successful login
        navigate('/dashboard'); // Adjust path as needed
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="invalid-feedback">Username is required.</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">Password is required.</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
          <button type="button" className="btn btn-secondary w-100" onClick={handleSignUpRedirect}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
