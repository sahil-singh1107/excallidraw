import express, { Router } from "express"
import authMiddleware, { IGetUserAuthInfoRequest } from "../../middleware";
import { prisma } from "@repo/db/client";

const chatRouter : Router = express.Router();

chatRouter.get("/chats/:roomId", authMiddleware, async function (req : IGetUserAuthInfoRequest, res) {
    const roomId = req.params.roomId

    try {
        const chats = await prisma.chat.findMany({where : {roomId : Number(roomId)}, orderBy: {id : "desc"}, take : 50});

        res.status(200).json({chats});
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
})

export default chatRouter