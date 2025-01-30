const Link = require("../models/storingLink");

const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find(shortLinkId);
    res.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ message: "Error fetching links" });
  }
};

const createShortLink = async (req, res) => {
  const { originalLink, expiration, remarks } = req.body;
  const shortLinkId = Math.random().toString(36).substr(2, 6); // Temporary short link

  try {
    const newLink = new Link({
      originalLink,
      shortLinkId,
      expiration,
      remarks,
      clicks: 0,
      status: "Active",
    });
    await newLink.save();

    res.status(201).json({ shortLinkId });
  } catch (error) {
    console.error("Error creating short link:", error);
    res.status(500).json({ message: "Error creating short link" });
  }
};

const getShortLink = async (req, res) => {
  const { shortLinkId} = req.params;

  try {
    const link = await Link.findOne({ shortLinkId});
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    res.json(shortLinkId);
    res.redirect(link.originalLink);
  } catch (error) {
    console.error("Error retrieving link:", error);
    res.status(500).json({ message: "Error retrieving link" });
  }
};

module.exports = {
  getAllLinks,
  createShortLink, // ✅ Ensure this is exported
  getShortLink,
};
