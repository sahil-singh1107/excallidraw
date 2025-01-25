import express, { Router } from "express"
import authMiddleware, { IGetUserAuthInfoRequest } from "../../middleware";
import { prisma } from "@repo/db/client";

const roomRouter: Router = express.Router();

roomRouter.get("/rooms/:slug", async function (req: IGetUserAuthInfoRequest, res) {
    const slug = req.params.slug as string
    const userId = req.userId
    console.log(userId);
    try {
        const room = await prisma.room.findUnique({
            where: {
                slug: slug
            }
        })
        res.status(200).json({ room })

        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

roomRouter.post("/create", authMiddleware, async function (req: IGetUserAuthInfoRequest, res) {
    const userId = req.userId
    const { slug } = req.body

    try {
        await prisma.room.create({
            data: {
                slug,
                adminId: Number(userId)
            }
        })
        res.status(200).send("Room created")
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

roomRouter.get("/getRooms", authMiddleware, async function (req: IGetUserAuthInfoRequest, res) {
    const userId = req.userId
    console.log(userId);
    try {
        const rooms = await prisma.room.findMany({ where: { adminId: Number(userId) }, select: { slug: true } });
        res.status(200).json({ rooms });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
})

export default roomRouter