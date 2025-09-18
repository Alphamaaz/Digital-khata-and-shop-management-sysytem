import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

import NotFound from "./pages/NotFound";
import SideBar from "./components/SideBar";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import AddProducts from "./pages/AddProducts";
import CustomerDetails from "./pages/CustomerDetails";
import EntryDetails from "./pages/EntryDetails";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import NewPassword from "./pages/NewPassword";
import Dashboard from "./Dashboard/Dashboard";
import Register from "./pages/Register";

const App = () => {
  const language = useSelector((state) => state.language.mode);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

if(!isAuthenticated){
  alert("Your session has been expired Please login again")
}
  useEffect(() => {
    document.body.style.direction = language === "urdu" ? "rtl" : "ltr";
    const storedTheme = localStorage.getItem("theme") || "light";
    document.body.className =
      storedTheme === "dark" ? "dark-mode" : "light-mode";
  }, [language]);

 

  return (
    <Router>
      {/* Show Sidebar only if user is logged in */}
      {isAuthenticated && <SideBar />}

      <Routes>
        {/* Redirect to home if user is logged in */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/customer/:id"
          element={isAuthenticated ? <CustomerDetails /> : <Navigate to="/" />}
        />
        <Route
          path="/entry/:id"
          element={isAuthenticated ? <EntryDetails /> : <Navigate to="/" />}
        />

        <Route
          path="/analytics"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/additems"
          element={isAuthenticated ? <AddProducts /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
