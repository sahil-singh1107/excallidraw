import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = require("@repo/backend-common/config")
export interface IGetUserAuthInfoRequest extends Request {
    userId?: string;
}

const authMiddleware = (req : IGetUserAuthInfoRequest, res : Response, next : NextFunction) => {
    const token = req.headers["authorization"];

    if (!token) {
       res.status(401).json({ message: "Authorization header is missing or malformed" });
       return;
    }
    try {
        const decoded = jwt.verify(token!, JWT_SECRET) as unknown as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export default authMiddleware