import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
    try {
        const { fullname, username, email, password, cPassword } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email is invalid" });
        }

        if (password !== cPassword) {
            return res.status(400).json({ error: "Password and confirm password should match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password should be minimum 6 characters" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username is taken" });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ error: "Email already used" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        const isCorrectPassword = await bcrypt.compare(password, user?.password || "");

        if (!user || !isCorrectPassword) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 });

        res.status(200).json({message:"Logged out succeddfully"});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}

export { signup, login, logout, getMe };