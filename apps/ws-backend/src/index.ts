import WebSocket, { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
const wss = new WebSocketServer({ port: 8080 });
import { JWT_SECRET } from "@repo/backend-common/config"
import {prisma} from "@repo/db/client"
interface User {
  ws: WebSocket
  rooms: string[]
  userId: string
}

const users: User[] = []

wss.on('connection',  function connection(ws, request) {

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

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string)

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws)
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws)
      user?.rooms.filter(x => x === parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId
      const message = parsedData.message

      await prisma.chat.create({data : {
        roomId,
        message,
        userId
      }})

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