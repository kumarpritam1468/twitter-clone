import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { commentPost, createPost, deletePost, likePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from "../controllers/postController.js";

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.post('/create', protectRoute, createPost);
router.delete('/delete/:id', protectRoute, deletePost);
router.post('/like/:id', protectRoute, likePost);
router.post('/comment/:id', protectRoute, commentPost);

export default router;