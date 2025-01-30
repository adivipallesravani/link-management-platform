const express = require("express");
const {
  getAllAnalytics,
  createAnalytics,
  getAnalyticsByShortLinkId,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", getAllAnalytics);
router.post("/", createAnalytics);
router.get("/:shortLinkId", getAnalyticsByShortLinkId);

module.exports = router;
