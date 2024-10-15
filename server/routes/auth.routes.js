import express from 'express'
import { getProfile, login, logout, reCreateAccessToken, signup } from '../controllers/auth.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/recreate-token", reCreateAccessToken)

router.get("/me", protectedRoute, getProfile)

export default router