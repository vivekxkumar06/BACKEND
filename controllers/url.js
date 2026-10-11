const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    console.log("Request body:", req.body);

    const body = req.body;

    if (!body || !body.url) {
      return res.status(400).json({
        error: "url is required",
      });
    }

    const shortID = nanoid(8);

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    return res.status(201).json({
      id: shortID,
    });
  } catch (error) {
    console.error("URL creation error:", error);

    return res.status(500).json({
      error: "Failed to create short URL",
    });
  }
}

module.exports = {
  handleGenerateNewShortURL,
};
