const User = require("../models/user");
const { setUser } = require("../service/auth");

// GET all users
async function handleGetAllUsers(req, res) {
  try {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

// GET user by ID
async function handleGetUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
}

// CREATE user through API
async function handleCreateUser(req, res) {
  try {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !email) {
      return res.status(400).json({
        msg: "First name and email are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        msg: "Email already exists",
      });
    }

    const user = await User.create({
      firstName: first_name,
      lastName: last_name,
      email,
      gender,
      jobTitle: job_title,
    });

    return res.status(201).json({
      msg: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

// SIGNUP through HTML form
async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    await User.create({
      firstName: name,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Signup failed");
  }
}

// LOGIN
async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).render("login", {
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = setUser(user);
    res.cookie("token", token);

    // Store token in cookie
    // res.cookie("uid", token, {
    //   httpOnly: true,
    //   sameSite: "lax",
    // });

    return res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Login failed");
  }
}

// UPDATE user
async function handleUpdateUserById(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      msg: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: "Invalid user ID or update data",
    });
  }
}

// DELETE user
async function handleDeleteUserById(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({
      msg: "User deleted successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Invalid user ID",
    });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
  handleUserSignup,
  handleUserLogin,
};
