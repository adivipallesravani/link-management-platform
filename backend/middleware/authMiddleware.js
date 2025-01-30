const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized access! Token missing or malformed." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info from token to the request
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token!" });
    }
};

module.exports = authenticate;
