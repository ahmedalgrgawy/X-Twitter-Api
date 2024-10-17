import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");

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

export const updateProfile = async (req, res) => {

    const userId = req.user._id;
    const { fullName, username, email, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;

    try {

        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);

            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }

            user.password = newPassword;
        }

        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;

        return res.status(200).json({ success: true, message: "Profile updated successfully", user });

    } catch (error) {
        console.log(error);

        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}