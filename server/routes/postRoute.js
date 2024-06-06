import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { commentPost, createPost, deletePost, likePost } from "../controllers/postController.js";

const router = express.Router();

router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likePost);
router.post('/comment/:id', protectRoute, commentPost);

export default router;