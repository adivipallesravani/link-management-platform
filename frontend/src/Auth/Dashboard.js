// Dashboard.js
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css"; // Make sure the styles are applied
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faLink, faChartPie, faCog, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Settings from "./Settings";
import Links from "./Links";
import Analytics from "./Analytics";  // Import Analytics component
import { Link } from "react-router-dom"; // Import Link for navigation

const Dashboard = () => {
    const [greeting, setGreeting] = useState("");
    const [icon, setIcon] = useState(faSun);
    const [time, setTime] = useState(new Date());
    const [username, setUsername] = useState("John Doe");
    const [initials, setInitials] = useState("");
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const savedLinks = JSON.parse(localStorage.getItem("links")) || [];
        setLinks(savedLinks);
    }, []);

    useEffect(() => {
        const currentHour = time.getHours();
        if (currentHour < 12) {
            setGreeting("Good morning");
            setIcon(faSun);
        } else if (currentHour < 18) {
            setGreeting("Good afternoon");
            setIcon(faSun);
        } else {
            setGreeting("Good night");
            setIcon(faMoon);
        }

        const nameParts = username.split(" ");
        const generatedInitials =
            nameParts.length > 1
                ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
                : nameParts[0][0].toUpperCase();
        setInitials(generatedInitials);
    }, [time, username]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toggleExpiration = () => setIsExpirationEnabled((prevState) => !prevState);

    const handleCreateLink = (e) => {
      e.preventDefault();
      const destination = e.target.destination.value; // Input for destination
      const remarks = e.target.remarks.value; // Input for remarks
      const expiration = isExpirationEnabled ? e.target.expiration.value : null;
  
      const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
      const shortLink = `${backendUrl}/s/${Math.random().toString(36).substring(7)}`;
  
      const newLink = {
          id: links.length + 1,
          destination, // Original link
          shortLink, // Shortened link
          remarks,
          expiration,
          clicks: 0,
          status: !expiration || new Date(expiration) > new Date() ? "Active" : "Inactive",
          date: new Date().toISOString(), // Add date for sorting
      };
  
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      localStorage.setItem("links", JSON.stringify(updatedLinks));
  
      closeModal(); // Close modal after adding
  };
  

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="logo">
                    <span className="logo-text">cuvette</span>
                </div>
                <ul className="menu">
                    <li className={`menu-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => handleSectionChange("dashboard")}>
                        <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
                        Dashboard
                    </li>
                    <li className={`menu-item ${activeSection === "links" ? "active" : ""}`} onClick={() => handleSectionChange("links")}>
                        <FontAwesomeIcon icon={faLink} className="menu-icon" />
                        Links
                    </li>
                    <li className={`menu-item ${activeSection === "analytics" ? "active" : ""}`} onClick={() => handleSectionChange("analytics")}>
                        <FontAwesomeIcon icon={faChartPie} className="menu-icon" />
                        Analytics
                    </li>
                    <li className={`menu-item ${activeSection === "settings" ? "active" : ""}`} onClick={() => handleSectionChange("settings")}>
                        <FontAwesomeIcon icon={faCog} className="menu-icon" />
                        Settings
                    </li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <span className="greeting">
                        <FontAwesomeIcon icon={icon} className="greeting-icon" /> {greeting}, {username}
                    </span>
                    <div className="time-date">{time.toLocaleTimeString()}</div>
                    <div className="header-actions">
                        <button className="create-btn" onClick={openModal}>
                            + Create new
                        </button>
                        <input type="text" className="search" placeholder="Search by remarks" />
                        <div className="profile-circle">{initials}</div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>New Link</h2>
                            <form onSubmit={handleCreateLink}>
                                <label>
                                    Destination URL:
                                    <input name="destination" type="text" placeholder="https://example.com" required />
                                </label>
                                <label>
                                    Remarks:
                                    <textarea name="remarks" placeholder="Add remarks" required />
                                </label>
                                <label className="link-expiration-container">
                                    Link Expiration:
                                    <label className="switch toggle-right">
                                        <input type="checkbox" checked={isExpirationEnabled} onChange={toggleExpiration} />
                                        <span className="slider round"></span>
                                    </label>
                                    <input name="expiration" type="datetime-local" className="expiration-input" disabled={!isExpirationEnabled} />
                                </label>
                                <div className="modal-actions">
                                    <button type="button" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button type="submit">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {activeSection === "dashboard" && (
                    <div>
                        <div className="total-clicks">
                            <h2>Total Clicks</h2>
                            <div className="click-number-container">
                                <span className="click-number">{links.reduce((acc, link) => acc + link.clicks, 0)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "links" && <Links links={links} setLinks={setLinks} />}

                {activeSection === "analytics" && <Analytics links={links} />} {/* Analytics is now rendered here */}

                {activeSection === "settings" && <Settings />}
            </div>
        </div>
    );
};

export default Dashboard;
