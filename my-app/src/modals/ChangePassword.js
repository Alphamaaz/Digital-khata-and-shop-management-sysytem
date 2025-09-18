import React, { useState } from "react";
import { useSelector } from "react-redux";
import closedEyeIcon from "../images/closed-eye.png";
import eyeIcon from "../images/eye.png";
import "../styles/changePassword.css"

const ChangePassword = ({ onClose }) => {
  const theme = useSelector((state) => state.theme.mode);
  const language = useSelector((state) => state.language.mode);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };
    return requirements;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwords.current)
      newErrors.current =
        language === "english"
          ? "Current password is required"
          : "موجودہ پاس ورڈ درکار ہے";

    if (!passwords.new)
      newErrors.new =
        language === "english"
          ? "New password is required"
          : "نیا پاس ورڈ درکار ہے";

    if (passwords.new !== passwords.confirm)
      newErrors.confirm =
        language === "english"
          ? "Passwords do not match"
          : "پاس ورڈ مماثل نہیں ہیں";

    const strength = validatePassword(passwords.new);
    if (Object.values(strength).filter((v) => v).length < 3) {
      newErrors.strength =
        language === "english"
          ? "Password must meet 3 of 4 requirements"
          : "پاس ورڈ کو 4 میں سے 3 تقاضوں کو پورا کرنا ہوگا";
    }

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setIsSubmitting(true);
    // Add your password change API call here
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <div className="password-modal">
      <div className="modal-content">
        <h2>
          {language === "english" ? "Change Password" : "پاس ورڈ تبدیل کریں"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              {language === "english" ? "Current Password" : "موجودہ پاس ورڈ"}
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
              />
              <img
                src={showPassword ? eyeIcon : closedEyeIcon}
                alt="toggle visibility"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  left: language === "urdu" ? "10px" : "",
                  right: language === "urdu" ? "" : "10px",
                }}
              />
            </div>
            {errors.current && <span className="error">{errors.current}</span>}
          </div>

          <div className="input-group">
            <label>
              {language === "english" ? "New Password" : "نیا پاس ورڈ"}
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
              />
            </div>
            {errors.new && <span className="error">{errors.new}</span>}
          </div>

          <div className="input-group">
            <label>
              {language === "english"
                ? "Confirm Password"
                : "پاس ورڈ کی تصدیق کریں"}
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
              />
            </div>
            {errors.confirm && <span className="error">{errors.confirm}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {language === "english" ? "Cancel" : "منسوخ کریں"}
            </button>
            <button
              type="submit"
              className="confirm-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? language === "english"
                  ? "Updating..."
                  : "اپ ڈیٹ ہو رہا ہے..."
                : language === "english"
                ? "Change Password"
                : "پاس ورڈ تبدیل کریں"}
            </button>
          </div>
        </form>

        {success && (
          <div className="success-message">
            {language === "english"
              ? "Password changed successfully!"
              : "پاس ورڈ کامیابی سے تبدیل ہو گیا!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
