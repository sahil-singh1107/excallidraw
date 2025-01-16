import WebSocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
const wss = new WebSocketServer({ port: 8080 });
import { JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db/client"
interface User {
  ws: WebSocket
  rooms: string[]
  userId: string
}

const users: Map<string, User> = new Map();

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

  users.set(userId, { userId, rooms: [], ws });

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string)
    console.log(parsedData)
    if (!parsedData) return;

    const user = users.get(userId);

    if (parsedData.type === "join_room") {
      if (user) user.rooms.push(parsedData.roomId);
      const members : string[] = [];
      for (let [k,v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          const findUser = await prisma.user.findUnique({where: {id : Number(v.userId)}});
          members.push(findUser!.username);
        }
      }
      for (let [k,v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type : "user_updates",
            members
          }))
        }
      }
    }

    if (parsedData.type === "leave_room") {
      if (user) {
        user.rooms = user.rooms.filter(x => x !== parsedData.roomId);
      }
      const members : string[] = [];
      for (let [k,v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          const findUser = await prisma.user.findUnique({where: {id : Number(v.userId)}});
          members.push(findUser!.username);
        }
      }
      for (let [k,v] of users) {
        if (v.rooms.includes(parsedData.roomId)) {
          v.ws.send(JSON.stringify({
            type : "user_updates",
            members
          }))
        }
      }
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId
      const message = parsedData.message

      // await prisma.chat.create({
      //   data: {
      //     roomId,
      //     message,
      //     userId
      //   }
      // })

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }
  });

});