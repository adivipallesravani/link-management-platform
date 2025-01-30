const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const analyticsRoutes = require("./routes/analyticsRoute"); // Import analytics routes
const bodyParser = require("body-parser");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: ["", "http://localhost:3000"], // URL of your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // HTTP methods allowed
    allowedHeaders: ["Content-Type", "Authorization"],
  };
   

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/analytics", analyticsRoutes); // Use analytics routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
