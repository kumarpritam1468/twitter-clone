import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import Notification from "../models/notificationModel.js";

const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-password');

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userToModify = await User.findById(id).select('-password');
        const currentUser = await User.findById(req.user._id).select('-password');

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: id
            });

            await newNotification.save();

            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateUserProfile = async (req, res) => {
    const { fullname, username, currentPassword, newPassword, bio, link, email } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ error: "Provide both new and current password" });
        }

        if (newPassword && currentPassword) {

            const isCorrect = await bcrypt.compare(currentPassword, user.password);

            if (!isCorrect) {
                return res.status(400).json({ error: "Current password is wrong" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password minimum 6 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
            }

            const uploadedImg = await cloudinary.uploader.upload(profileImg);

            profileImg = uploadedImg.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
            }

            const uploadedImg = await cloudinary.uploader.upload(coverImg);

            coverImg = uploadedImg.secure_url;
        }

        user.fullname = fullname || user.fullname;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const myFollowings = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])

        const filteredUsers = users.filter((user) => !myFollowings.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUserProfile };