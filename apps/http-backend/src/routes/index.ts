import express, { Router } from "express"
import userRouter from "./user";

const mainRouter : Router = express.Router();

mainRouter.use('/user', userRouter);

export default mainRouter