import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import Auth from "../utils/auth";
import { login } from "../api/authAPI";
import { UserLogin } from "../interfaces/UserLogin";

const Login = () => {
  const [loginData, setLoginData] = useState<UserLogin>({
    user_name: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize navigate

  // Handle changes in the input fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!loginData.user_name) newErrors.user_name = true;
    if (!loginData.password) newErrors.password = true;
    return newErrors;
  };

  // Handle form submission for login
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Call the login API endpoint with loginData
      const data = await login(loginData);
      // If login is successful, call Auth.login to store the token in localStorage
      Auth.login(data.token);

      // Redirect to /home
      document.location.assign("/home");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Failed to login", err); // Log any errors that occur during login
    }
  };

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
            <div className="mb-3">
              <label htmlFor="user_name" className="form-label">
                Username
              </label>
              <input
                type="text"
                className={`form-control ${errors.user_name ? "is-invalid" : ""}`}
                id="user_name"
                name="user_name"
                value={loginData.user_name}
                onChange={handleChange}
              />
              {errors.user_name && (
                <div className="invalid-feedback">Username is required.</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">Password is required.</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
            </button>
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={navigateToSignUp}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
