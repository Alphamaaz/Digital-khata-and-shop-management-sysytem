import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "../redux/themeSlice";
import { setLanguages, toggleLanguage } from "../redux/languageSlice";
import right from "../images/right-arrow.png";
import internet from "../images/internet.png";
import logoutt from "../images/logout (1).png";
import mode from "../images/themes.png";
import lock from "../images/padlock.png";
import close from "../images/cross-small.png";
import leftLogout from "../images/logout.png";
import left from "../images/left-arrow.png";
import "../styles/setting.css";
import ThemeToggle from "../components/ThemeToggle";
import { setLanguage } from "../utils/languages";
import ChangePassword from './../modals/ChangePassword';
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);
  const language = useSelector((state) => state.language.mode);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    const storedLanguage = localStorage.getItem("language") || "english";
    dispatch(setTheme(storedTheme));
    dispatch(setLanguages(storedLanguage));
    document.body.className =
      storedTheme === "dark" ? "dark-mode" : "light-mode";
    document.body.style.direction = storedLanguage === "urdu" ? "rtl" : "ltr";
  }, [dispatch]);

  const handleLanguageChange = (lang) => {
    localStorage.setItem("language", lang);
    document.body.style.direction = lang === "urdu" ? "rtl" : "ltr";
    dispatch(setLanguages(lang));
    setShowLanguageModal(false);
  };

  const LanguageModal = () => (
    <div className="modal-overlay">
      <div className="language-modal">
        <h3>Select Language</h3>
        <img src={close} alt="close"
          className="close-modal"
          style={{filter:`${theme==="dark"?"brightness(0) invert(1)":""}`}}
          onClick={() => setShowLanguageModal(false)}
        />
          
        <button onClick={() => handleLanguageChange("english")}>English</button>
        <button onClick={() => handleLanguageChange("urdu")}>اردو</button>
        
      </div>
    </div>
  );

  // Logout component

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const LogoutModal = () => (
    <div className="modal-overlay">
      <div className="logout-modal">
        <h3>
          {language === "english" ? "Confirm Logout" : "لاگ آؤٹ کی تصدیق کریں"}
        </h3>
        <p>
          {language === "english"
            ? "Are you sure you want to logout?"
            : "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟"}
        </p>
        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={() => setShowLogoutModal(false)}
          >
            {language === "english" ? "Cancel" : "منسوخ کریں"}
          </button>
          <button
            className="confirm-btn"
            onClick={() => {
              // Add your actual logout logic here
              dispatch(logout())
              navigate("/")
              console.log("User logged out");
              setShowLogoutModal(false);
            }}
          >
            {language === "english" ? "Logout" : "لاگ آؤٹ"}
          </button>
        </div>
      </div>
    </div>
  );
  const languages = setLanguage(language);

  return (
    <div
      className="settings-container"
      style={
        selectedSetting
          ? { gridTemplateColumns: "40% 60%" }
          : { gridTemplateColumns: "50%" }
      }
    >
      <div
        className={`more ${language === "urdu" ? "urdu-rtl" : "english-ltr"}`}
      >
        <div className="setting-header">{languages.more}</div>

        {/* Change Theme */}
        <div className={`setting-div`}>
          <div className="theme">
            <img src={mode} alt="theme" className="icon" />
            <h3
              style={{
                margin: `0 ${language === "urdu" ? "10px" : "0"} 0 ${
                  language === "english" ? "10px" : "0"
                }`,
              }}
            >
              {languages.changeTheme}
            </h3>
          </div>
          <ThemeToggle />
        </div>

        {/* Change Language */}
        <div
          className={`setting-div `}
          onClick={() => {
            setSelectedSetting("language");
            setShowLanguageModal(true);
          }}
        >
          <div className="theme">
            <img src={internet} alt="language" className="icon" />
            <h3
              style={{
                margin: `0 ${language === "urdu" ? "10px" : "0"} 0 ${
                  language === "english" ? "10px" : "0"
                }`,
              }}
            >
              {languages.chngeLanguage}
            </h3>
          </div>
          <img
            src={language === "urdu" ? left : right}
            alt="arrow"
            className="right"
          />
        </div>

        {/* Change Password */}
        <div
          className={`setting-div `}
          onClick={() => navigate("/forgot-password")}
        >
          <div
            className={`theme ${
              selectedSetting === "password" ? "setting-active" : ""
            }`}
          >
            <img src={lock} alt="lock" className="icon" />
            <h3
              style={{
                margin: `0 ${language === "urdu" ? "10px" : "0"} 0 ${
                  language === "english" ? "10px" : "0"
                }`,
              }}
            >
              {languages.changePassword}
            </h3>
          </div>
          <img
            src={language === "urdu" ? left : right}
            alt="arrow"
            className="right"
          />
        </div>

        {/* Logout */}
        <div
          className={`setting-div ${
            selectedSetting === "logout" ? "active" : ""
          }`}
          onClick={() => {
            setSelectedSetting("logout");
            setShowLogoutModal(true);
          }}
        >
          <div className="theme">
            <img
              src={language === "urdu" ? leftLogout : logoutt}
              alt="logout"
              className="icon"
              style={{ width: "20px", height: "20px" }}
            />
            <h3
              style={{
                margin: `0 ${language === "urdu" ? "10px" : "0"} 0 ${
                  language === "english" ? "10px" : "0"
                }`,
              }}
            >
              {languages.logout}
            </h3>
          </div>
          <img
            src={language === "urdu" ? left : right}
            alt="arrow"
            className="right"
          />
        </div>
      </div>

      {showLanguageModal && <LanguageModal />}
      {showLogoutModal && <LogoutModal />}

      {selectedSetting === "password" && (
        <ChangePassword onClose={() => setSelectedSetting(false)} />
      )}
    </div>
  );
};

export default Settings;
