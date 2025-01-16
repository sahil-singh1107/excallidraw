import axios from 'axios'
import ChatRoomClient from './ChatRoomClient'

async function getChats (roomId : number, token : string) {
    console.log(roomId);
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/chats/${roomId}`, {headers : {Authorization : token}})
    return res.data.chats;
}

const ChatRoom = async ({id, token} : {id : number, token : string}) => {

  let chats = await getChats(id, token);
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
