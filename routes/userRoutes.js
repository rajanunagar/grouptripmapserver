const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  getAllUserr,
  deleteUser
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validatetoken", validateToken, (req, res) => {
  res.status(200).json({ valid: true });
});
router.post("/current", validateToken, currentUser);
router.route('/').get(getAllUserr).delete(validateToken, deleteUser);

module.exports = router;
