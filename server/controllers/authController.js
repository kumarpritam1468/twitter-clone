import generateTokenAndSetCookie from "../lib/utils/generateToken";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
    try {
        const { fullname, username, email, password, cPassword } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Email is invalid"});
        }

        if (password !== cPassword) {
            return res.status(400).json({ error: "Password and confirm password should match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username is taken" });
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail) {
            return res.status(400).json({error:"Email already used"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password:hashedPassword
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
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
        res.status(500).json({error:"Internal Server Error"});
    }
}

const login = async (req, res) => {

}

const logout = async (req, res) => {

}

export default signup;