import { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Importing CSS for styling
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../redux/authSlice";
import BASE_URL from "../utils/baseUrl";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate()
  const dispatch =  useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      // Save token & user info in localStorage
      dispatch(loginSuccess(response.data.token))
       navigation('/home')// Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p className="subtext">Log in to manage your vegetable shop</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="forgot-password">
          Forgot password? <NavLink to="/forgot-password">Reset here</NavLink>
        </p>
        <p className="forgot-password">
          New here ? <NavLink to="/register">Sign Up</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
