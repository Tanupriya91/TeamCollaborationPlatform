import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/authMiddleware.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

io.on("connection",(socket)=>{
    console.log("Connected:",socket.id);
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
});