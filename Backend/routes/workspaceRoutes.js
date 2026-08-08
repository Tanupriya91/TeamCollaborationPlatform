import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
    createWorkspace,
    getWorkspaces
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);

router.get("/", authMiddleware, getWorkspaces);

export default router;