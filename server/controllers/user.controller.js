import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }

}

export const getSuggestedUsers = async (req, res) => {

    try {
        const userId = req.user._id;

        // get users followed by me
        const usersFollowedByMe = await User.findById(userId).select("following");

        // get 10 random users expect me
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

        // filter users not followed by me
        const filteredUsers = users.filter(user => {
            return !usersFollowedByMe.following.includes(user._id.toString());
        })

        // get 4 suggested users
        const suggestedUsers = filteredUsers.slice(0, 4)

        // empty their password for security purpose
        suggestedUsers.forEach((user) => { user.password = null })

        return res.status(200).json({ success: true, suggestedUsers })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }

}

export const toggleFollow = async (req, res) => {

    try {
        const { id } = req.params;

        const currentUser = await User.findById(req.user._id);
        const userToToggle = await User.findById(id);

        if (!userToToggle || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "Cannot follow yourself" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {

            // decrease followers for target user
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id }
            })

            // decrease following for current user
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id }
            })

            res.status(200).json({ success: true, message: "User Unfollowed successfully" });

        } else {
            // increase followers for target user
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id }
            })

            // increase following for current user
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id }
            })

            // send notification to target user

            const notification = await Notification.create({
                from: req.user._id,
                to: id,
                type: "follow",
            })

            await notification.save()

            res.status(200).json({ success: true, message: "User followed successfully" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const updateProfile = async (req, res) => { }