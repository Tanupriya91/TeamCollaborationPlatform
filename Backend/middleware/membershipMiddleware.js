import { db } from "../config/firebase.js";

export async function membershipMiddleware(req, res, next) {
    try {
        const userId = req.user.uid;
        const { workspaceId } = req.params;

        if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace ID is required"
            });
        }

        const membershipSnapshot = await db
            .collection("memberships")
            .where("userId", "==", userId)
            .where("workspaceId", "==", workspaceId)
            .limit(1)
            .get();

        if (membershipSnapshot.empty) {
            return res.status(403).json({
                message: "You are not a member of this workspace"
            });
        }

        req.membership = {
            id: membershipSnapshot.docs[0].id,
            ...membershipSnapshot.docs[0].data()
        };

        next();

    } catch (error) {
        console.error("Membership middleware error:", error);

        return res.status(500).json({
            message: "Failed to verify workspace membership",
            error: error.message
        });
    }
}