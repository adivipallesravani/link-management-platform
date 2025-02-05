import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import Chart from "../Auth/Clicks";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Fetch the links from the backend on component mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${MAIN_URL}/api/links`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setLinks(data.links); // Set the fetched links to the state
        } else {
          console.error("Error fetching links:", data.message);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleExpiration = () =>
    setIsExpirationEnabled((prevState) => !prevState);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleCreateLink = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(e.target);
    const destination = formData.get("destination");
    const remarks = formData.get("remarks");
    const expiration = formData.get("expiration");

    // Construct the link data object
    const newLink = {
      originalLink: destination,
      remarks: remarks,
      expiration: expiration || null, // Expiration can be null if not provided
    };

    try {
      // Send a request to your backend to create the new link
      const response = await fetch(`${MAIN_URL}/api/links/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newLink),
      });

      const data = await response.json();

      if (response.ok) {
        // If the link is created successfully, update the state to add the new link
        setLinks((prevLinks) => [...prevLinks, data.link]); // Assuming 'data.link' contains the new link data
        closeModal(); // Close the modal after successful creation
      } else {
        console.error("Error creating link:", data.message);
      }
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src="download 1.png" alt="Cuvette logo" className="logo-image" />
        </div>

        <ul className="menu">
          <li
            className={`menu-item ${activeSection === "dashboard" ? "active" : ""}`}
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
            className={`menu-item ${activeSection === "analytics" ? "active" : ""}`}
            onClick={() => handleSectionChange("analytics")}
          >
            <FontAwesomeIcon icon={faChartPie} className="menu-icon" />
            Analytics
          </li>
          <li
            className={`menu-item ${activeSection === "settings" ? "active" : ""}`}
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
            <div className="date">{date}</div>
          </div>
          <div className="header-actions">
            <button className="create-btn" onClick={openModal}>
              + Create new
            </button>
            <div className="search-container">
              <div className="search-wrapper">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by remarks"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
                />
              </div>
            </div>

            <div className="profile-circle">{initials}</div>
          </div>
        </div>

        {activeSection === "dashboard" && (
          <div className="total-clicks">
            <Chart activeSection={activeSection} />
          </div>
        )}

        {activeSection === "links" && (
          <Links links={links} setLinks={setLinks} searchTerm={searchTerm} />
        )}
        {activeSection === "analytics" && <Analytics links={links} />}
        {activeSection === "settings" && <Settings />}

        {/* Modal for creating a new item */}
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
      </div>
    </div>
  );
};

export default Dashboard;
