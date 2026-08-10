import express from "express";

import {
    createProject,
    getProjects
} from "../controllers/projectController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { membershipMiddleware } from "../middleware/membershipMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post(
    "/",
    authMiddleware,
    membershipMiddleware,
    createProject
);

router.get(
    "/",
    authMiddleware,
    membershipMiddleware,
    getProjects
);

export default router;