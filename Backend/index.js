import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/authMiddleware.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import { membershipMiddleware } from "./middleware/membershipMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/workspaces", workspaceRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer,{
    cors: {
        origin: process.env.CLIENT_URL,
    },
});
app.get("/health",(req,res)=>{
    res.json({status: "ok"});
});

app.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user);
});

app.get(
    "/workspaces/:workspaceId/test-membership",
    authMiddleware,
    membershipMiddleware,
    (req, res) => {
        res.json({
            message: "Membership verified",
            membership: req.membership
        });
    }
);

io.on("connection",(socket)=>{
    console.log("Connected:",socket.id);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
});