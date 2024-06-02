import express from "express";
import {signup, login, logout, getMe} from "../controllers/authController.js"
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get('/me', protectRoute, getMe);
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

export default router;