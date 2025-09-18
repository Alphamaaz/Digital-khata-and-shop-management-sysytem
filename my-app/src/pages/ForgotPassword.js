import React, { useState } from "react";
import axios from "axios";
import "../styles/ForgotPassword.css"; // Import CSS for styling
import BASE_URL from "../utils/baseUrl";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
      `${BASE_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(response.data.message);
      setLoading(false);
      setSuccess(true); // Show success message
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password</p>

        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
      {success && (
        <div className=" success-modal">
          <div className="success-modal-content">
            <h3>Success!</h3>
            {message && <p className="success">{message}</p>}
            <button onClick={() => setSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
