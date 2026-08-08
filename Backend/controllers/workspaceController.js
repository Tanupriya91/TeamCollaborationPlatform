import { db } from "../config/firebase.js";

export async function createWorkspace(req, res) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Workspace name is required",
            });
        }

        const userId = req.user.uid;

        // Create references first
        const workspaceRef = db.collection("workspaces").doc();
        const membershipRef = db.collection("memberships").doc();

        // Create batch
        const batch = db.batch();

        // Workspace document
        batch.set(workspaceRef, {
            name,
            createdBy: userId,
            createdAt: new Date(),
        });

        // Owner membership
        batch.set(membershipRef, {
            userId,
            workspaceId: workspaceRef.id,
            role: "owner",
            joinedAt: new Date(),
        });

        // Commit both writes together
        await batch.commit();

        return res.status(201).json({
            message: "Workspace created successfully",
            workspace: {
                id: workspaceRef.id,
                name,
                createdBy: userId,
            },
        });

    } catch (error) {
        console.error("Create workspace error:", error);

        return res.status(500).json({
            message: "Failed to create workspace",
            error: error.message,
        });
    }
}