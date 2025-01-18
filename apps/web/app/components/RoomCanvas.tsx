import ChatRoomClient from './ChatRoomClient'

const RoomCanvas = async ({id} : {id : number}) => {

  return (
    <>
        <ChatRoomClient id={id} />
    </>
  )
}

export default RoomCanvas
