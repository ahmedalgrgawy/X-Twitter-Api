import Notification from "../models/notification.model.js";


export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        })

        if (!notification) {
            return res.status(404).json({ success: false, message: "No notifications found" });
        }

        await Notification.updateMany({ to: userId }, { $set: { read: true } });

        return res.status(200).json({ success: true, notification });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const clearNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        return res.status(200).json({ success: true, message: "Notifications Cleared" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id.toString();

        await Notification.findOneAndDelete({ _id: notificationId, to: userId });

        await Notification.updateMany({ to: userId });

        return res.status(200).json({ success: true, message: "Notification deleted" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}
