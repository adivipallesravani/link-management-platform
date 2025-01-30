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
    const [formData, setFormData] = useState({ email: "", password: "" });
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
    
            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token); // Save token in localStorage
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
                <div className="logo-container">
                    <span className="logo">
                        C
                        <div className="u-logo-container">
                            <img src="/Vector.png" alt="u logo" className="logo-image" />
                            <img src="/Vector (1).png" alt="inner logo" className="inner-image" />
                        </div>
                        vette
                    </span>
                </div>
            </div>

            <div className="register-form">
                <div className="auth-links">
                    <Link to="/register" className="link signup-link">SignUp</Link>
                    <Link to="/login" className="link login-link">Login</Link>
                </div>
                <h2>Login</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
