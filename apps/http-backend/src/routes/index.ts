import express, { Router } from "express"
import userRouter from "./user";
import chatRouter from "./chat";
import roomRouter from "./room";

const mainRouter : Router = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use("/chat", chatRouter);
mainRouter.use("/room", roomRouter);

export default mainRouter