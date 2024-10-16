import cloudinary from "../lib/cloudinary.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"

export const getAllPosts = async (req, res) => { }
export const getFollowingPosts = async (req, res) => { }
export const getLikedPosts = async (req, res) => { }
export const getUserPosts = async (req, res) => { }

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!text && !img) {
            return res.status(400).json({ success: false, message: "Post cannot be empty" });
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const post = new Post({
            user: userId,
            text,
            img,
        });

        await post.save();

        return res.status(200).json({ success: true, post });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const toggleLikes = async (req, res) => { }
export const commentOnPost = async (req, res) => { }
export const deletePost = async (req, res) => { }