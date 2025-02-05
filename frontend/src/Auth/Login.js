import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

console.log(MAIN_URL);

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: ""});
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            console.log("Submitting login data:", formData);
            const response = await axios.post(`${MAIN_URL}/auth/login`, formData);
            console.log("response", response);
            
            const token = response.data.token;
            const name = response.data.user.name;
         
            if (token) {
                localStorage.setItem("token", token); // Save token in localStorage
                localStorage.setItem("name", name);
                console.log("Name saved to localStorage:", localStorage.getItem("name"));
                console.log("Token saved to localStorage:", localStorage.getItem("token"));
                alert("Login successful!");
                navigate("/dashboard");
            } else {
                setErrorMessage("Token is missing in the response");
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || "Invalid login credentials");
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
                    <Link to="/register" className="link signup-link">SignUp</Link>
                    <Link to="/login" className="link login-link">Login</Link>
                </div>

                {/* Heading */}
                <h2>Login</h2>

                {/* Error Message */}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email id"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </form>

                <p>
                    Don't have an account? <Link to="/register">SignUp</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
