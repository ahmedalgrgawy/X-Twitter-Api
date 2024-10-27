import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'

import {
    commentOnPost,
    createPost,
    deletePost,
    editComment,
    editPost,
    getAllPosts,
    getFollowingPosts,
    getLikedPosts,
    getUserPosts,
    toggleLikes,
    deleteComment
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/following", protectedRoute, getFollowingPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.get("/user/:username", protectedRoute, getUserPosts);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, toggleLikes);
router.post("/comment/:id", protectedRoute, commentOnPost);
router.post("/edit-comment/:id", protectedRoute, editComment);
router.post("/delete-comment/:id", protectedRoute, deleteComment);
router.post("/edit/:id", protectedRoute, editPost);
router.delete("/delete/:id", protectedRoute, deletePost);

export default router;