const Link = require("../models/storingLink");
const Analytics = require("../models/analytics");
const mongoose = require("mongoose");

const useragent = require("useragent");
const MAIN_URL =
  process.env.NODE_ENV === "production"
    ? "https://linkmanagementplatformbackend.vercel.app" // Production URL
    : "http://localhost:5000";

const createShortLink = async (req, res) => {
    const { originalLink, expiration, remarks } = req.body;
  
    // Check if req.user is available
    if (!req.user) {
      return res.status(400).json({ message: "User not authenticated." });
    }
  
    // Access the correct userId from req.user
    const userId = req.user.userId;  // Note that it's req.user.userId, not req.user.id
   console.log(userId);
    // Generate the short link
    const shortLinkId = `${Math.random().toString(36).substring(7)}`;
  
    try {
      const newLink = new Link({
        originalLink,
        shortLinkId,
        userId,  // Pass the correct userId here
        expiration,
        remarks,
        clicks: 0,
        status: "Active",
      });
  
      await newLink.save();
  
      res.status(201).json({ shortLinkId,userId ,remarks}); // Return the shortLinkId to the user
    } catch (error) {
      console.error("Error creating short link:", error);
      res.status(500).json({ message: "Error creating short link" });
    }
  };
  
  
  const getAllLinks = async (req, res) => {
    try {
        console.log("req.user in getAllLinks:", req.user);  // Add this logging

        const userId = req.user ? req.user.userId : null;

        if (!userId) {
            console.error("User ID not found.");
            return res.status(400).json({ message: "User ID not found." });
        }

        // Continue with fetching links for the authenticated user
        const objectIdUserId = new mongoose.Types.ObjectId(userId);
        const links = await Link.find({ userId: objectIdUserId });

        res.json(links);
    } catch (error) {
        console.error("Error fetching links:", error);
        res.status(500).json({ message: "Error fetching links" });
    }
};



  const updateLink = async (req, res) => {
    const { id } = req.params;
    const { originalLink, expiration, remarks } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid link ID" });
        }

        const link = await Link.findById(id);

        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }

        // Ensure the authenticated user owns the link
        if (link.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to update this link" });
        }

        link.originalLink = originalLink || link.originalLink;
        link.expiration = expiration || link.expiration;
        link.remarks = remarks || link.remarks;

        await link.save();

        res.json({ message: "Link updated successfully", link });
    } catch (error) {
        console.error("Error updating link:", error);
        res.status(500).json({ message: "Error updating link" });
    }
};


// Delete a link

const deleteLink = async (req, res) => {
  const { id } = req.params;

  try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid link ID" });
      }

      const link = await Link.findById(id);

      if (!link) {
          return res.status(404).json({ message: "Link not found" });
      }

      // Ensure the authenticated user owns the link
      if (link.userId.toString() !== req.user.userId) {
          return res.status(403).json({ message: "Unauthorized to delete this link" });
      }

      await Link.findByIdAndDelete(id);

      res.json({ message: "Link deleted successfully" });
  } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ message: "Error deleting link" });
  }
};


module.exports = {
  getAllLinks,
  createShortLink, updateLink,deleteLink,
};
