import express, { Router } from "express"
import userRouter from "./user";
import chatRouter from "./chat";

const mainRouter : Router = express.Router();

mainRouter.use('/user', userRouter);
mainRouter.use("/chat", chatRouter)

export default mainRouter