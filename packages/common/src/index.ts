import { z } from "zod";

export const UserSchema = z.object({
    firstName : z.string().min(3, {
        message : "Must be atleast 3 characters"
    }),
    lastName: z.string().min(3, {message : "Must be atleast 3 characters"}),
    email : z.string(),
    password: z.string().min(3, {message : "Must be atleast 8 characters"}),
    username : z.string().min(5, {message : "Must be atleast 5 characters"})
})

export const SiginSchema = z.object({
    email : z.string(),
    password: z.string().min(3, {message : "Must be atleast 8 characters"})
})

export const CreateRoomSchema = z.object({
    roomName : z.string()
})