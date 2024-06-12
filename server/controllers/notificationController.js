import Notification from "../models/notificationModel.js";

const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId}).populate({
            path:"from",
            select:"username profileImg"
        });

        await Notification.updateMany({to:userId}, {read:true});

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to: userId});

        res.status(200).json({message:"Notifications deleted successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const deleteOneNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id: notificationId} = req.params;

        const notification = await Notification.findById(notificationId);

        if(!notification) return res.status(404).json({error:"Notification not found"});

        if(notification.to.toString() !== userId.toString()) {
            return res.status(403).json({error:"Unauthorized Access"});
        }

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({message:"Notification Deleted Successfully"});
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export { getNotification, deleteNotification };