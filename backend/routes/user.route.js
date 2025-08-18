const {
  signup,
  signin,
  updateUser,
  updateAvatar,
  currentUser,
  logoutUser,
  verifyMail,
  forgotPassword,
  resetPassword,
  updateGameInUser,
  deleteGameInUser,
  updateGameStatusInUser,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/", signup);

router.post("/login", signin);

// création des routes pour les modifications
router.put("/", updateUser);
router.put("/avatar", updateAvatar);

router.get("/currentUser", currentUser);

router.get("/verifyMail/:token", verifyMail);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.delete("/deleteToken", logoutUser);

router.put("/:id/games/update", updateGameInUser);
router.delete("/:id/games/delete", deleteGameInUser);
router.put("/:id/games/status/update", updateGameStatusInUser);

module.exports = router;

// localhost:3000/user
