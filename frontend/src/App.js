import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Dashboard from "./Auth/Dashboard";
import Settings from "./Auth/Settings";

import Analytics from "./Auth/Analytics";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const storedLinks = localStorage.getItem("links");
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<Dashboard links={links} setLinks={setLinks} />}
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Register />} />
          
          <Route
            path="/analytics"
            element={<Analytics links={links} setLinks={setLinks} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
