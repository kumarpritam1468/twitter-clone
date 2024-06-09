import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ error: "User not found" });

        if (!text && !img) return res.status(400).json({ error: "Post must have text or image" });

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            img,
            text
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: "Post not found" });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized Access!" });
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const currentUserId = req.user._id.toString();

        const user = await User.findById(currentUserId);

        if (!user) return res.status(400).json({ error: "User not found" });

        const post = await Post.findById(postId);

        if (!post) return res.status(400).json({ error: "Post not found" });

        const alreadyLiked = post.likes.includes(currentUserId);

        if (alreadyLiked) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: currentUserId } });
            await User.updateOne({ _id: currentUserId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ message: "Post disliked Successfully" });
        } else {
            await Post.updateOne({ _id: postId }, { $push: { likes: currentUserId } });
            await User.updateOne({ _id: currentUserId }, { $push: { likedPosts: postId } });
            const notification = new Notification({
                from: currentUserId,
                to: post.user,
                type: "like"
            });

            await post.save();
            await notification.save();
            res.status(200).json({ message: "Post liked Successfully" });
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
}

const commentPost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { comment } = req.body;

        const currentUserId = req.user._id.toString();

        const user = await User.findById(currentUserId);

        if (!user) return res.status(400).json({ error: "User not found" });

        const post = await Post.findById(postId);

        if (!post) return res.status(400).json({ error: "Post not found" });

        post.comments.push({
            text: comment,
            user: currentUserId
        });

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'comments.user',
                select: '-password'
            })

        if (!posts) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getLikedPosts = async (req, res) => {
    try {
        const { id: userId } = req.params;

        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ error: "User not found" });

        const likes = await Post.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ error: "User not found" });

        const following = user.following;

        const followingPosts = await Post.find({ user: { $in: following } }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(followingPosts);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getUserPosts = async (req, res) => {
    try {
        const username = req.params;

        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ error: "User not found" });

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export { createPost, deletePost, likePost, commentPost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts };