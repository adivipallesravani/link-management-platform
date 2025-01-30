import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Dashboard from "./Auth/Dashboard";
import Settings from "./Auth/Settings";
import RedirectPage from "./Auth/RedirectPage";
import Analytics from "./Auth/Analytics";

const App = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const storedLinks = localStorage.getItem("links");
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<Dashboard links={links} setLinks={setLinks} />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Login />} />
        <Route path="/s/:shortId" element={<RedirectPage />} />
        {/* Ensure links and setLinks are passed here */}
        <Route
          path="/analytics"
          element={<Analytics links={links} setLinks={setLinks} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
