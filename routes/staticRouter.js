const express = require("express");
const URL = require("../models/url");
const { restricTo } = require("../middlewares/auth");

const router = express.Router();

// ADMIN: Get all URLs
router.get("/admin/urls", restricTo(["ADMIN"]), async (req, res) => {
  try {
    const allurls = await URL.find({});

    return res.render("home", {
      urls: allurls,
    });
  } catch (error) {
    console.error("Error fetching all URLs:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// NORMAL USER: Get only their own URLs
router.get("/", restricTo(["NORMAL"]), async (req, res) => {
  try {
    const allurls = await URL.find({
      createdBy: req.user._id,
    });

    return res.render("home", {
      urls: allurls,
    });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Login page
router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
