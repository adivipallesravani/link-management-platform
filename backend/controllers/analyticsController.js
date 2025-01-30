const Analytics = require("../models/Analytics");

// Get all analytics data
const getAllAnalytics = async (req, res) => {
  try {
    const analyticsData = await Analytics.find();
    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};

// Create a new analytics entry
const createAnalytics = async (req, res) => {
  const { timestamp, originalLink, shortLinkId, ipAddress, userDevice } = req.body;

  try {
    const newAnalytics = new Analytics({
      timestamp,
      originalLink,
      shortLinkId, // Fixed from shortLink
      ipAddress,
      userDevice,
    });

    await newAnalytics.save();
    res.status(201).json({ message: "Analytics data saved successfully" });
  } catch (error) {
    console.error("Error saving analytics:", error);
    res.status(500).json({ message: "Error saving analytics data" });
  }
};

// Get analytics data by shortLinkId
const getAnalyticsByShortLinkId = async (req, res) => {
  const { shortLinkId } = req.params;

  try {
    const analytics = await Analytics.find({ shortLinkId });

    if (!analytics.length) {
      return res.status(404).json({ message: "No analytics found for this link" });
    }

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics data" });
  }
};

module.exports = {
  getAllAnalytics,
  createAnalytics,
  getAnalyticsByShortLinkId,
};
