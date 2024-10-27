import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDb } from './lib/connectDb.js';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import postsRoutes from './routes/posts.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json({ limit: '10mb' }))

app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/notifications", notificationsRoutes)

app.listen(port, () => {
    console.log('Server Running on ' + port)
    connectDb()
})