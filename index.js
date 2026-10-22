const express = require("express");
const path = require("path");
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const userRouter = require("./routes/user");

const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8000;

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));

app.use(cookieParser());

// EJS Configuration
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Home Page
app.get("/", async (req, res) => {
  try {
    const allUrls = await URL.find({});

    return res.render("home", {
      urls: allUrls,
    });
  } catch (error) {
    console.error("Home page error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// User Routes
app.use("/user", userRouter);

// URL Shortener Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);

// Other Static Routes
app.use("/", checkAuth, staticRoute);

// Redirect Short URL
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

// Connect MongoDB and Start Server
connectMongoDb("mongodb://localhost:27017/short-url")
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
