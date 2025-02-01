import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import { useNavigate } from "react-router-dom";
const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;
    console.log(MAIN_URL);

const Settings = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            navigate("/login"); // Redirect to login if not logged in
        }
    }, [navigate]);

    const handleSaveChanges = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }
    
        const url = `${MAIN_URL}/auth/update-user`; // Ensure this URL is correct
        console.log("Making PUT request to:", url);
        console.log("Authorization header:", `Bearer ${token}`);
    
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email, mobile }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(text || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log("User updated:", data);
                alert("Changes saved successfully!");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(`Failed to save changes: ${error.message}`);
            });
    };
    
    const handleDeleteAccount = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }
    
        const url = `${MAIN_URL}/auth/delete-user`; // Ensure this URL is correct
        console.log("Making DELETE request to:", url);
        console.log("Authorization header:", `Bearer ${token}`);
    
        fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((text) => {
                        throw new Error(text || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log("Account deleted:", data);
                alert("Account deleted successfully!");
                localStorage.removeItem("token"); // Clear token after account deletion
                navigate("/login"); // Redirect to login page after deletion
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(`Failed to delete account: ${error.message}`);
            });
    };
    
    return (
        <div className="settings-container">
         
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </label>
                <label>
                    Mobile
                    <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter your mobile number"
                    />
                </label>
                <button
                    type="button"
                    className="save-button"
                    onClick={() => setShowSavePopup(true)}
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    className="delete-button"
                    onClick={() => setShowDeletePopup(true)}
                >
                    Delete Account
                </button>
            </form>

            {showSavePopup && (
                <div className="popup-container">
                    <div className="popup">
                        <p>Are you sure you want to save the changes?</p>
                        <button onClick={() => setShowSavePopup(false)}>No</button>
                        <button
                            onClick={() => {
                                handleSaveChanges();
                                setShowSavePopup(false);
                            }}
                        >
                            Yes
                        </button>
                    </div>
                    <div className="popup-overlay" onClick={() => setShowSavePopup(false)}></div>
                </div>
            )}

            {showDeletePopup && (
                <div className="popup-container">
                    <div className="popup">
                        <p>Are you sure you want to delete the account?</p>
                        <button onClick={() => setShowDeletePopup(false)}>No</button>
                        <button
                            onClick={() => {
                                handleDeleteAccount();
                                setShowDeletePopup(false);
                            }}
                        >
                            Yes
                        </button>
                    </div>
                    <div className="popup-overlay" onClick={() => setShowDeletePopup(false)}></div>
                </div>
            )}
        </div>
    );
};

export default Settings;
