import { z } from "zod";

export const UserSchema = z.object({
    firstName : z.string().min(3, {
        message : "First Name is too short"
    }),
    lastName: z.string().min(3, {message : "Last name is too short"}),
    email : z.string(),
    password: z.string().min(3, {message : "Password is too short"}),
    username : z.string().min(5, {message : "Username is too short"})
})

export const SiginSchema = z.object({
    email : z.string(),
    password: z.string().min(3, {message : "Password is too short"})
})

export const CreateRoomSchema = z.object({
    roomName : z.string()
})