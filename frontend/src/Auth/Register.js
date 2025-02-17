import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    // State to manage form data
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });

    // State to manage error messages
    const [errorMessage, setErrorMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, mobile, password, confirmPassword } = formData;

        // Frontend validation
        if (!name || !email || !mobile || !password || !confirmPassword) {
            setErrorMessage("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            // Send data to the backend
            const response = await axios.post(`${MAIN_URL}/auth/register`, formData);
            console.log(response);

            // Success response
            alert("User registered successfully!");
            navigate("/login");

            setErrorMessage(""); // Clear error message
            setFormData({
                name: "",
                email: "",
                mobile: "",
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            // Display error from backend
            setErrorMessage(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="register-container">
            {/* Left side with background image */}
            <div
                className="register-image"
                style={{
                    backgroundImage: `url('/m_image.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "50%",
                    height: "100vh",
                }}
            >
                {/* Single Logo Image */}
                <div className="logo-container">
                    <img src="download 1.png" alt="Cuvette logo" className="logo-image" />
                </div>
            </div>

            {/* Right side with the form */}
            <div className="register-form">
                {/* Top right for "Signup" and "Login" */}
                <div className="auth-links">
                    <a href="/signup" className="link signup-link">Signup</a>
                    <a href="/login" className="link login-link">Login</a>
                </div>

                {/* Heading */}
                <h2>Join us Today!</h2>

                {/* Error Message */}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email id"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile no."
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
