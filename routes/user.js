const express = require("express");

const {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUserById,
  handleDeleteUserById,
  handleUserSignup,
  handleUserLogin,
} = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

// GET all users and CREATE user
router.route("/").get(handleGetAllUsers).post(handleCreateUser);

// GET, UPDATE and DELETE a user by ID
router
  .route("/:id")
  .get(handleGetUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
