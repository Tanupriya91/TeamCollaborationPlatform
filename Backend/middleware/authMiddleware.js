import { getAuth } from "firebase-admin/auth";
import { firebaseApp } from "../config/firebase.js";

export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid token format",
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await getAuth(firebaseApp).verifyIdToken(token);

        req.user = decodedToken;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            error: err.message,
        });
    }
}