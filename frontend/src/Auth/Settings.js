import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import { useNavigate } from "react-router-dom";

const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

const Settings = () => {
    const [userData, setUserData] = useState({ name: "", email: "", mobile: "" });
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            navigate("/login");
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        const updatedFields = {};
        Object.keys(userData).forEach(key => {
            if (userData[key] !== originalData[key]) {
                updatedFields[key] = userData[key];
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert("No changes made.");
            return;
        }

        fetch(`${MAIN_URL}/auth/update-user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedFields),
        })
            .then(response => response.json())
            .then(data => {
                alert("Changes saved successfully!");
                setOriginalData(userData);
            })
            .catch(error => {
                console.error("Error updating user:", error);
                alert("Failed to save changes.");
            });
    };

    const handleDeleteAccount = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        fetch(`${MAIN_URL}/auth/delete-user`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(() => {
                alert("Account deleted successfully.");
                localStorage.clear();
                navigate("/login");
            })
            .catch(error => {
                console.error("Error deleting account:", error);
                alert("Failed to delete account.");
            });
    };

    return (
        <div className="settings-container">
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Mobile</label>
                    <input
                        type="tel"
                        name="mobile"
                        value={userData.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter your mobile number"
                    />
                </div>
                <button type="button" className="save-button" onClick={handleSaveChanges}>
                    Save Changes
                </button>
                <button type="button" className="delete-button" onClick={handleDeleteAccount}>
                    Delete Account
                </button>
            </form>
        </div>
    );
};

export default Settings;
