import React, { useState, useEffect } from "react";
import "../styles/Settings.css";
import { useNavigate } from "react-router-dom";

const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

const Settings = () => {
    const [userData, setUserData] = useState({ name: "", email: "", mobile: "" });
    const [originalData, setOriginalData] = useState({ name: "", email: "", mobile: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You are not logged in.");
            navigate("/login");
            return;
        }

        fetch(`${MAIN_URL}/auth/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setUserData({ name: data.name, email: data.email, mobile: data.mobile });
                setOriginalData({ name: data.name, email: data.email, mobile: data.mobile });
            }
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
           
        });
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
    
        // Ensure that we send all fields, even if some are unchanged
        const updatedFields = {
            name: userData.name || originalData.name, 
            email: userData.email || originalData.email,
            mobile: userData.mobile || originalData.mobile
        };
    
        // Only send updated fields (if any)
        if (Object.keys(updatedFields).length === 0 || 
            (updatedFields.name === originalData.name && 
             updatedFields.email === originalData.email && 
             updatedFields.mobile === originalData.mobile)) {
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
            if (data.needLogout) {
                alert("Your email has been updated. Please log in again.");
                localStorage.clear(); // Clear the stored token
                navigate("/login"); // Redirect to login page
            } else {
                alert("Changes saved successfully!");
                setOriginalData(userData);
            }
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
