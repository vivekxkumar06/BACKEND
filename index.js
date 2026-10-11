const express = require("express");
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");

const URL = require("./models/url");
const userRouter = require("./routes/user");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8000;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logReqRes("log.txt"));

// Home route
app.get("/", (req, res) => {
  return res.send("Hello World");
});

// User routes
app.use("/user", userRouter);

// URL Shortener routes
app.use("/url", urlRoute);

// Redirect route
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true },
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// MongoDB Connection and Server
connectMongoDb("mongodb://localhost:27017/short-url")
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
