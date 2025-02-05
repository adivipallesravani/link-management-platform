const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const authenticate = require("./middleware/authMiddleware"); 
const bodyParser = require("body-parser");
const Analytics=require("./models/analytics")
const Link = require("./models/storingLink");
const User = require("./models/user"); 


dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: ["https://link-management-platform-frontend.vercel.app", "http://localhost:3000"], // URL of your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // HTTP methods allowed
    allowedHeaders: ["Content-Type", "Authorization"],
  };
   

// Middleware

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/api", linkRoutes);
app.options("*", cors(corsOptions));




app.get("/user-details", authenticate, async (req, res) => {
  console.log("Authenticated user:", req.user); // Check if user is attached to req.user
  try {
      const user = await User.findById(req.user.userId); // Fetch user using ID from token
      if (!user) {
          return res.status(404).json({ message: "User not found!" });
      }
      res.status(200).json(user);
  } catch (error) {
      console.error("Error fetching user:", error); // Log error to debug
      res.status(500).json({ message: "Server error", error: error.message });
  }
});


// PUT /api/links/:shortLinkId - Update the link with the given shortLinkId
app.put("/links/:shortLinkId", authenticate, async (req, res) => {
  const { shortLinkId } = req.params;  // Extract shortLinkId from the request params
  const { originalLink, expiration, remarks } = req.body;  // Data to update

  try {
      // Find the link by shortLinkId
      const link = await Link.findOne({ shortLinkId });

      if (!link) {
          return res.status(404).json({ message: "Link not found" }); // If no link found, return error
      }

      // Update the link fields if provided in the request body
      link.originalLink = originalLink || link.originalLink;
      link.expiration = expiration || link.expiration;
      link.remarks = remarks || link.remarks;

      // Save the updated link
      const updatedLink = await link.save();

      return res.status(200).json(updatedLink); // Return the updated link as the response
  } catch (error) {
      console.error("Error updating link:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});


// Get all analytics for a specific user (filtered by userId)
app.get("/analytics", authenticate, async (req, res) => {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const analyticsData = await Analytics.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
  
      const totalRecords = await Analytics.countDocuments({ userId });
      const totalPages = Math.ceil(totalRecords / limit);
  
      return res.status(200).json({ data: analyticsData, totalPages });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


  
  // Get all analytics data in one API call
  app.get("/analytics/analytics-summary", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId; // Ensure this is correctly extracted

        // Convert userId to ObjectId if needed
        const mongoose = require("mongoose");
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Total clicks per user
        const totalClicks = await Analytics.countDocuments({ userId: userObjectId });

        // Total clicks grouped by device type
        const deviceClicks = await Analytics.aggregate([
            { $match: { userId: userObjectId } }, // Ensure correct userId match
            { 
                $group: { 
                    _id: "$device", 
                    count: { $sum: 1 } 
                } 
            }
        ]);

        // Date-wise clicks for the user
        const dateWiseClicks = await Analytics.aggregate([
            { $match: { userId: userObjectId } },
            { 
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                } 
            },
            { $sort: { _id: 1 } } // Sort by date
        ]);

        return res.status(200).json({
            totalClicks,
            deviceClicks,
            dateWiseClicks
        });
    } catch (error) {
        console.error("Error fetching analytics summary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});





// Function to detect user device
const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent)) return "mobile";
    if (/tablet/i.test(userAgent)) return "tablet";
    return "desktop";
  };
  
  // Function to detect browser
  const getBrowser = (userAgent) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Other";
  };
  
  // Function to detect OS
  const getOS = (userAgent) => {
    if (/windows/i.test(userAgent)) return "Windows";
    if (/mac/i.test(userAgent)) return "MacOS";
    if (/android/i.test(userAgent)) return "Android";
    if (/ios|iphone|ipad/i.test(userAgent)) return "iOS";
    return "Other";
  };
  
  // Redirect short link and track analytics
  
  app.get("/:shortLinkId", authenticate, async (req, res) => {
      const {shortLinkId} = req.params; // Corrected this line
      const userAgent = req.headers["user-agent"] || "";
      console.log("Received shortLinkId:", shortLinkId);
      console.log("Searching in DB for:", { shortLinkId });
  
      const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const userId = req.user.userId;  // Assuming authentication middleware has set req.user
    
      console.log("User ID: ", userId); // Log userId to confirm
    
      try {
          const link = await Link.findOne({shortLinkId });
  
          console.log(link);
          if (!link) {
              return res.status(404).json({ message: "Link not found" });
          }
  
          // Log the original link and short link before using them
          console.log("Original Link: ", link.originalLink);  // Log the original link
          console.log("Shortened URL: ", `${req.protocol}://${req.get("host")}/${link.shortLinkId}`);  // Log the short link
  
          // Increment click count
          link.clicks += 1;
          await link.save();
  
          // Capture analytics and ensure originalLink and shortenedUrl are saved
          const analyticsData = new Analytics({
              userId,  // Store the userId in the analytics entry
              timestamp: new Date(), // Exact timestamp
              device: getDeviceType(userAgent),
              ipAddress: ipAddress,
              os: getOS(userAgent),
              browser: getBrowser(userAgent),
              originalLink: link.originalLink,  // Store the original link
              shortLink: `${req.protocol}://${req.get("host")}/${link.shortLinkId}`,  // Store the short link
          });
  
          // Log the analytics data before saving it
          console.log("Analytics Data: ", analyticsData);  // Log the analytics object
  
          // Save the analytics entry
          const savedAnalytics = await analyticsData.save();
  
          // Log the saved analytics object
          console.log("Saved Analytics: ", savedAnalytics);
  
          // Push the full analytics data to the link's analytics array
          link.analytics.push(savedAnalytics._id);  // Store the analytics _id in the link
          await link.save();
  
          // Log the updated link with analytics
          console.log("Link after saving analytics: ", link);
  
          // Redirect user to the original link
          return res.redirect(link.originalLink);
      } catch (error) {
          console.error("Error redirecting link:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));