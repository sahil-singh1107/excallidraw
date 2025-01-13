import express, { Router } from "express"
import authMiddleware, { IGetUserAuthInfoRequest } from "../../middleware";
import { prisma } from "@repo/db/client";

const chatRouter : Router = express.Router();

chatRouter.get("/chats", authMiddleware, async function (req : IGetUserAuthInfoRequest, res) {
    const userId = req.userId
    const roomName = req.query.room as string;

    try {
        const room = await prisma.room.findUnique({where : {slug : roomName}});
        const chats = await prisma.chat.findMany({where : {roomId : room?.id}});

        res.status(200).json({chats});
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"});
        return;
    }
})

export default chatRouter