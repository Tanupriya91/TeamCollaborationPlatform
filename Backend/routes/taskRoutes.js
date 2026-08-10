import express from "express";

import {
    createTask,
    getTasks
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

export default router;