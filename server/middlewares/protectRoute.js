import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({error:"Unauthorized access"});
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if(!decoded) {
            return res.status(401).json({error:"Unauthorized access"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(400).json({error:"User not found"});
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export default protectRoute;