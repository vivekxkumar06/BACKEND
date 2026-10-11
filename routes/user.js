const express = require("express");

const {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");

const router = express.Router();

// GET all users and CREATE user
router.route("/").get(handleGetAllUsers).post(handleCreateUser);

// GET, UPDATE and DELETE a user by ID
router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
