import React from "react";
import SideBar from "../components/SideBar";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <SideBar />
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
