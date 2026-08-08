import { db } from "../config/firebase.js";

export async function createWorkspace(req, res) {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Workspace name is required"
            });
        }

        const userId = req.user.uid;

        const workspaceRef = db.collection("workspaces").doc();
        const membershipRef = db.collection("memberships").doc();

        const batch = db.batch();

        batch.set(workspaceRef, {
            name,
            createdBy: userId,
            createdAt: new Date()
        });

        batch.set(membershipRef, {
            userId,
            workspaceId: workspaceRef.id,
            role: "owner",
            joinedAt: new Date()
        });

        await batch.commit();

        return res.status(201).json({
            message: "Workspace created successfully",
            workspace: {
                id: workspaceRef.id,
                name,
                createdBy: userId
            }
        });

    } catch (error) {
        console.error("Create workspace error:", error);

        return res.status(500).json({
            message: "Failed to create workspace",
            error: error.message
        });
    }
}


export async function getWorkspaces(req, res) {
    try {
        const userId = req.user.uid;

        const membershipsSnapshot = await db
            .collection("memberships")
            .where("userId", "==", userId)
            .get();

        const workspaces = [];

        for (const membershipDoc of membershipsSnapshot.docs) {
            const membership = membershipDoc.data();

            const workspaceDoc = await db
                .collection("workspaces")
                .doc(membership.workspaceId)
                .get();

            if (workspaceDoc.exists) {
                workspaces.push({
                    id: workspaceDoc.id,
                    ...workspaceDoc.data(),
                    role: membership.role
                });
            }
        }

        return res.status(200).json({
            workspaces
        });

    } catch (error) {
        console.error("Get workspaces error:", error);

        return res.status(500).json({
            message: "Failed to get workspaces",
            error: error.message
        });
    }
}