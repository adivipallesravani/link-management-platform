const express = require("express");
const { createShortLink, getAllLinks, updateLink, deleteLink } = require("../controllers/linkController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Create a short link
router.post("/create", authenticate, createShortLink);
router.get("/links", authenticate, getAllLinks);
router.put("/links/:id", authenticate, updateLink);
router.delete("/links/:id", authenticate, deleteLink);



 
  
module.exports = router;
