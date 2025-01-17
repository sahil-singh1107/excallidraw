import ChatRoomClient from './ChatRoomClient'

const ChatRoom = async ({id} : {id : number}) => {

  return (
    <>
        <ChatRoomClient id={id} />
    </>
  )
}

export default ChatRoom
