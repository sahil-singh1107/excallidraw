import express, { Router } from "express"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {JWT_SECRET} from "@repo/backend-common/config"
import {UserSchema, SiginSchema, CreateRoomSchema} from "@repo/common/config"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import authMiddleware, { IGetUserAuthInfoRequest } from "../../middleware"
const userRouter : Router = express.Router()

userRouter.post("/signup", async function (req, res) {
    const {firstName, lastName, email, password, username } = req.body;

    try {

        const result = UserSchema.safeParse(req.body);

        if (!result.success) {
            res.status(411).json({message : "Invalid data"})
            return;
        }

        const findUser = await prisma.user.findUnique({where: {email}});
        if (findUser) {
            res.status(411).json({message : "User already exists"})
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({data : {
            firstName, 
            lastName,
            email,
            username,
            password : hashedPassword
        }});
        const token = jwt.sign({userId : user.id}, JWT_SECRET);
        res.status(200).json({message : "User created", token});
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }
})

userRouter.post("/sigin", async function (req, res) {
    const {email , password}  = req.body

    try {
        const result = SiginSchema.safeParse(req.body);
        if (!result.success) {
            res.status(411).json({message : "Invalid data"})
            return;
        }
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            res.status(411).json({message : "User with this email doesn't exists"})
            return;
        }
        const isMatched = bcrypt.compare(password, user.password);
        if (!isMatched) {
            res.status(411).json({message : "Wrong password or email"})
            return;
        }
        const token = jwt.sign({userId :  user.id}, JWT_SECRET);
        res.status(200).json({message : "User created", token});
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }
})

userRouter.post("/create-room", authMiddleware, function (req : IGetUserAuthInfoRequest ,res) {
    const userId = req.userId
    
})


export default userRouter