import express from "express";

import userCtrl from "../controllers/userCtrl";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";
import loginLimiter from "../middleware/loginLimiter";

const router = express.Router();

router.post("/register", userCtrl.register);

router.post("/login", loginLimiter, userCtrl.login);

router.put("/user-image", auth, userCtrl.userImage);

router.put("/user-data", auth, userCtrl.userData);

router.put("/user-address", auth, userCtrl.userAddress);

router.post("/reset-password", auth, userCtrl.resetPassword);

router.get("/users", authAdmin, userCtrl.getUsers);

router.get("/me", auth, userCtrl.getMe);

export default router;
