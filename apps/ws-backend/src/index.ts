import WebSocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
const wss = new WebSocketServer({ port: 8080 });
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db/client"
interface User {
  ws: WebSocket
  rooms: string[]
  userId: string
  color: string
  x: number
  y: number
  status: boolean
  message: string
}

const users: Map<string, User> = new Map();

function generateRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  return hexColor;
}

wss.on('connection', async function connection(ws, request) {

  const url = request.url

  if (!url) return;

  let userId

  try {
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');
    const decoded = jwt.verify(token!, JWT_SECRET);
    if (!decoded || !(decoded as JwtPayload).userId) {
      ws.close();
      return;
    }
    userId = (decoded as JwtPayload).userId;
  } catch (error) {
    console.log(error);
  }

  if (!userId) {
    ws.close();
    return;
  }



  users.set(userId, { userId, rooms: [], ws, color: generateRandomColor(), x: 0, y: 0, status: false, message: "" });

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string)
    console.log(parsedData)
    if (!parsedData) return;

    const user = users.get(userId);

    if (parsedData.type === "cursor_move") {
      for (let [k, v] of users) {
        if (v.ws === ws && v.rooms.includes(parsedData.roomId)) {
          v.x = parsedData.x,
            v.y = parsedData.y
        }
      }
      const members: { username: string, color: string, x: number, y: number, status: boolean, message: string }[] = [];
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          const findUser = await prisma.user.findUnique({ where: { id: Number(v.userId) } });
          members.push({ username: findUser!.username, color: v.color, x: v.x, y: v.y, status: v.status, message: v.message });
        }
      }
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type: "user_updates",
            members
          }))
        }
      }
    }

    if (parsedData.type === "join_room") {
      if (user) user.rooms.push(parsedData.roomId);
      const members: { username: string, color: string, x: number, y: number, status: boolean, message: string }[] = [];
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          const findUser = await prisma.user.findUnique({ where: { id: Number(v.userId) } });
          members.push({ username: findUser!.username, color: v.color, x: v.x, y: v.y, status: v.status, message: v.message });
        }
      }
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type: "user_updates",
            members
          }))
        }
      }
    }

    if (parsedData.type === "leave_room") {
      if (user) {
        user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
      }
      const members: { username: string, color: string, x: number, y: number, status: boolean, message: string }[] = [];
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          const findUser = await prisma.user.findUnique({ where: { id: Number(v.userId) } });
          members.push({ username: findUser!.username, color: v.color, x: v.x, y: v.y, status: v.status, message: v.message });
        }
      }
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type: "user_updates",
            members
          }))
        }
      }
    }

    if (parsedData.type === "shape") {
      
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type: "shape",
            data: parsedData.data
          }))
        }
      }
      //prisma.shape.create
    }

    if (parsedData.type === "update_shapes") {
      console.log(parsedData);
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type: "update_shapes",
            data: parsedData.data
          }))
        }
      }
    }

    if (parsedData.type === "emoji") {
      for (let [k, v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type: "emoji",
            data: parsedData.data
          }))
        }
      }
    }

  });

});