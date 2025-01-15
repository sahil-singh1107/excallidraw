import express, { Router } from "express"
import authMiddleware from "../../middleware";
import { prisma } from "@repo/db/client";

const roomRouter : Router = express.Router();

roomRouter.get("/rooms/:slug", authMiddleware, async function (req, res) {
    const slug = req.params.slug

    try {
        const room = await prisma.room.findUnique({where: {
            slug : slug
        }})        

        res.status(200).json({room})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }
})

export default roomRouter