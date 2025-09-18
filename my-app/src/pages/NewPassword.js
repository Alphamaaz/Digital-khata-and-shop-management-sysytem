import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/newPassword.css";
import BASE_URL from "../utils/baseUrl";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { token } = useParams(); // Get token from URL

  const navigate = useNavigate();

 const handleResetPassword = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError("");
   setMessage("");

   if (password !== confirmPassword) {
     setError("Passwords do not match!");
     setLoading(false);
     return;
   }

   try {
     const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
       token, // Token from URL
       password, // Send 'password' instead of 'newPassword'
     });

     setMessage(response.data.message);
     setTimeout(() => navigate("/"), 3000);
   } catch (err) {
     setError(err.response?.data?.message || "Something went wrong");
   }

   setLoading(false);
 };


  return (
    <div className="new-password-container">
      <div className="new-password-box">
        <h2>Reset Your Password</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
