import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { getSuggestedUsers, getUserProfile, searchUsers, toggleFollow, updateProfile } from '../controllers/user.controller.js'

const router = express.Router()

router.get("/profile/:username", protectedRoute, getUserProfile)

router.get("/suggested", protectedRoute, getSuggestedUsers)

router.get("/search", protectedRoute, searchUsers)

router.post("/follow/:id", protectedRoute, toggleFollow)

router.post("/update", protectedRoute, updateProfile)

export default router