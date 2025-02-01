import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faLink,
  faChartPie,
  faCog,
  faMoon,
  faSun,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Settings from "./Settings";
import Links from "./Links";
import Analytics from "./Analytics";
import { Link } from "react-router-dom";
const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;
    console.log(MAIN_URL);

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [icon, setIcon] = useState(faSun);
  const [time, setTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
  const [links, setLinks] = useState([]);
  const [date, setDate] = useState("");
  
  const storedName = localStorage.getItem("name");

  // Function to get initials
  const getInitials = (name) => {
    const nameParts = name.trim().split(" ");
    return nameParts.length > 1
      ? nameParts[0][0] + nameParts[1][0]
      : nameParts[0].slice(0, 2).toUpperCase();
  };

  const initials = storedName ? getInitials(storedName) : "";

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

    const formattedDate = time.toLocaleDateString("en-US", {
      weekday: "short", // e.g. 'Sat'
      month: "short", // e.g. 'Feb'
      day: "numeric",
      year: "2-digit", // e.g. '25'
    });
    setDate(formattedDate);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleExpiration = () =>
    setIsExpirationEnabled((prevState) => !prevState);

  const handleCreateLink = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Retrieve the values from the form inputs
    const destination = e.target.destination.value;
    const remarks = e.target.remarks.value;
    const expiration = isExpirationEnabled ? e.target.expiration.value : null;

    // Generate a short link
    const shortLinkId = `${Math.random().toString(36).substring(7)}`;

    // Prepare the new link object to send to the backend
    const newLink = {
      originalLink: destination,
      shortLinkId,
      remarks,
      expiration,
      clicks: 0, // Ensure clicks are initialized to 0
      status: !expiration || new Date(expiration) > new Date() ? "Active" : "Inactive",
      date: new Date().toISOString(),
    };

    // POST request to the backend to create the new link
    try {
      const response = await fetch(`${MAIN_URL}/api/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization header for auth token
        },
        body: JSON.stringify(newLink),
      });

      const data = await response.json();

      // Handle the response
      if (response.ok) {
        setLinks((prevLinks) => [...prevLinks, data.link]); // Add the new link to the links state
        closeModal(); // Close the modal after link creation
      } else {
        console.error("Error creating link:", data.message); // Log error if the response is not OK
      }
    } catch (error) {
      console.error("Error creating link:", error); // Log any errors from the fetch request
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo-container">
          <span className="logo">
            C
            <div className="u-logo-container">
              <img src="/Vector.png" alt="u logo" className="logo-image" />
              <img
                src="/Vector (1).png"
                alt="inner logo"
                className="inner-image"
              />
            </div>
            vette
          </span>
        </div>
        <ul className="menu">
          <li
            className={`menu-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("dashboard")}
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
            Dashboard
          </li>
          <li
            className={`menu-item ${activeSection === "links" ? "active" : ""}`}
            onClick={() => handleSectionChange("links")}
          >
            <FontAwesomeIcon icon={faLink} className="menu-icon" />
            Links
          </li>
          <li
            className={`menu-item ${
              activeSection === "analytics" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("analytics")}
          >
            <FontAwesomeIcon icon={faChartPie} className="menu-icon" />
            Analytics
          </li>
          <li
            className={`menu-item ${
              activeSection === "settings" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("settings")}
          >
            <FontAwesomeIcon icon={faCog} className="menu-icon" />
            Settings
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="greeting-container">
            <span className="greeting">
              <span
                role="img"
                aria-label="yellow-sun"
                style={{ color: "yellow" }}
              >
                ☀️
              </span>
              {greeting}, {storedName}
            </span>
            <div className="date">{date}</div>{" "}
            {/* Date directly below the greeting */}
          </div>
          <div className="header-actions">
            <button className="create-btn" onClick={openModal}>
              + Create new
            </button>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search"
                placeholder="Search by remarks"
              />
            </div>
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
                  <input
                    name="destination"
                    type="text"
                    placeholder="https://example.com"
                    required
                  />
                </label>
                <label>
                  Remarks:
                  <textarea name="remarks" placeholder="Add remarks" required />
                </label>
                <label className="link-expiration-container">
                  Link Expiration:
                  <label className="switch toggle-right">
                    <input
                      type="checkbox"
                      checked={isExpirationEnabled}
                      onChange={toggleExpiration}
                    />
                    <span className="slider round"></span>
                  </label>
                  <input
                    name="expiration"
                    type="datetime-local"
                    className="expiration-input"
                    disabled={!isExpirationEnabled}
                  />
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
          <div className="total-clicks">
            <h2>Total Clicks</h2>
            <div className="click-number-container">
              <span className="click-number">
                {links && Array.isArray(links) && links.length > 0 ? (
                  <>
                    <pre>{JSON.stringify(links, null, 2)}</pre>{" "}
                    {/* Log links for debugging */}
                    <span className="click-number">
                      {links.reduce((acc, link) => acc + (link.clicks || 0), 0)}
                    </span>
                  </>
                ) : (
                  <span className="click-number">0</span>
                )}
              </span>
            </div>
          </div>
        )}

        {activeSection === "links" && (
          <Links links={links} setLinks={setLinks} />
        )}
        {activeSection === "analytics" && <Analytics links={links} />}
        {activeSection === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
