import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path'
import { connectDb } from './lib/connectDb.js';
import authRoutes from './routes/auth.routes.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json({ limit: '10mb' }))

app.use(cookieParser())

app.use("/api/auth", authRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });

}

app.listen(port, () => {
    console.log('Server Running on ' + port)
    connectDb()
})