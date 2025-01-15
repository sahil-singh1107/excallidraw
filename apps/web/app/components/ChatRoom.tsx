import axios from 'axios'
import ChatRoomClient from './ChatRoomClient'

async function getChats (roomId : number) {
    console.log(roomId);
    const res = await axios.get(`http://localhost:3001/api/v1/chat/chats/${roomId}`, {headers : {Authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczNjgwMjI5Nn0.pt4HDL36dux6J2kPx96ei4nM5HpoIvOLyR40lcl8uPQ"}})
    return res.data.chats;
}

const ChatRoom = async ({id} : {id : number}) => {

  let chats = await getChats(id);
  chats = chats
  .filter((chat: any) => chat.message) 
  .map((chat: any) => chat.message); 
  return (
    <>
        <ChatRoomClient messages={chats} id={id} />
    </>
  )
}

export default ChatRoom
