import { useSelector } from "react-redux"; // Access theme state
import "../styles/sideBar.css";
import { NavLink } from "react-router-dom";
import HomeIcon from "../images/phome.png";
import addIcon from "../images/apps-add.png";
import chartIcon from "../images/chart-histogram.png";
import settingtIcon from "../images/settings.png";


const SideBar = () => {
  const theme = useSelector((state) => state.theme.mode); // Get current theme
  const language = useSelector((state) => state.language.mode); // Get current language
  // const direction = layOut(language); // Determine direction (rtl or ltr)

  const themeColors = {
    light: {
      background: "#28a745",
      text: "#fff",
    },
    dark: {
      background: "#343a40",
      text: "#fff",
    },
  };

  const colors = themeColors[theme];

  return (
    <div
      className={`side_bar ${language}`}
      
      style={{
        backgroundColor: colors.background,
      }}
    >
      <NavLink
        to="/"
        className="sidebar-link"
        style={{
          color: colors.text,
        }}
      >
        <img src={HomeIcon} alt="home" className="icon" />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/additems"
        className="sidebar-link"
        style={{
          color: colors.text,
        }}
      >
        <img src={addIcon} alt="add" className="icon" />
        <span>Items</span>
      </NavLink>
      <NavLink
        to="/analytics"
        className="sidebar-link"
        style={{
          color: colors.text,
        }}
      >
        <img src={chartIcon} alt="analytics" className="icon" />
        <span>Analytics</span>
      </NavLink>
      <NavLink
        to="/settings"
        className="sidebar-link"
        style={{
          color: colors.text,
        }}
      >
        <img src={settingtIcon} alt="settings" className="icon" />
        <span>Settings</span>
      </NavLink>
    </div>
  );
};

export default SideBar;
