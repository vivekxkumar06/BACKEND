const User = require("../models/user");

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

// CREATE user
async function handleCreateUser(req, res) {
  try {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !last_name || !email || !gender || !job_title) {
      return res.status(400).json({
        msg: "All fields are required",
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
    if (error.code === 11000) {
      return res.status(409).json({
        msg: "Email already exists",
      });
    }

    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

// UPDATE user
async function handleUpdateUserById(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
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
};
