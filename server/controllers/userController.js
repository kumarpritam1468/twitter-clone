import User from "../models/userModel.js";

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
            await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}});
            res.status(200).json({message:"User unfollowed successfully"});
        } else {
            await User.findByIdAndUpdate(id, {$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push:{following:id}});
            res.status(200).json({message:"User followed successfully"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"});
    }
}

const updateUserProfile = async (req, res) => {

}

const getSuggestedUsers = async (req, res) => {

}

export { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUserProfile };