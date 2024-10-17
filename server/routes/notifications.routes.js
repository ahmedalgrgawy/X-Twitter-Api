import express from "express";
import { clearNotifications, deleteNotification, getNotifications } from "../controllers/notification.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.delete("/clear", protectedRoute, clearNotifications);
router.delete("/:id", protectedRoute, deleteNotification);

export default router;