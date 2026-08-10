import express from "express";

import {
    createTask,
    getTasks,
    updateTaskStatus
} from "../controllers/taskController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { membershipMiddleware } from "../middleware/membershipMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post(
    "/",
    authMiddleware,
    membershipMiddleware,
    createTask
);

router.get(
    "/",
    authMiddleware,
    membershipMiddleware,
    getTasks
);

router.patch(
    "/:taskId/status",
    authMiddleware,
    membershipMiddleware,
    updateTaskStatus
);

export default router;