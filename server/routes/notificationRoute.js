import express from "express";
import { getNotification, deleteNotification, deleteOneNotification } from "../controllers/notificationController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get('/', protectRoute, getNotification);
router.delete('/delete', protectRoute, deleteNotification);
router.delete('/delete/:id', protectRoute, deleteOneNotification);

export default router;