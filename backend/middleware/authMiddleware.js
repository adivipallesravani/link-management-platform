const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const token = req.header("Authorization") && req.header("Authorization").split(" ")[1]; // Extract token
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access! Token missing or malformed." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ message: "Unauthorized access! Token invalid or expired." });
    }
};
module.exports = authenticate;