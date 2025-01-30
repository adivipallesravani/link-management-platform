const express = require("express");
const Link = require("../models/storingLink");
const {
  getAllLinks,
  createShortLink,
  getShortLink,
} = require("../controllers/linkController"); // ✅ Ensure correct path

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const links = await Link.find(); // Fetch all links
      res.json({ links });
    } catch (error) {
      console.error("Error fetching links:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
router.post("/create", createShortLink); // ✅ Ensure function exists
router.get("/:shortLinkId", getShortLink);


module.exports = router;
