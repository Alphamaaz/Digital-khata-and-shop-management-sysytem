// ThemeToggle.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import "../styles/ThemeToggle.css";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const handleToggle = () => {
    // Determine the new theme
    const newTheme = theme === "light" ? "dark" : "light";
    // Save to localStorage
    localStorage.setItem("theme", newTheme);
    // Update the body's class for styling purposes
    document.body.className = newTheme === "dark" ? "dark-mode" : "light-mode";
    // Dispatch the toggle action to update Redux state
    dispatch(toggleTheme());
  };

  return (
    <div className="toggle-container">
      <label className="switch">
       
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={handleToggle}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;
