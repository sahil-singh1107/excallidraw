
import axios from "axios"
import RoomCanvas from "../../components/RoomCanvas";


async function getRoom (slug : string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/rooms/${slug}`)
    return res.data.room.id;
  } catch (error) {
    console.log(error);
  }
}

const page = async ({params} : {params : {slug : string}}) => {

    const { slug } = await params

    const roomId = await getRoom(slug);

  return (
    <RoomCanvas id = {roomId}  />
  )
}

export default page