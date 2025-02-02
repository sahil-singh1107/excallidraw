
import axios from "axios"
import RoomCanvas from "../../components/RoomCanvas";


async function getRoom (slug : string, token : string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/rooms/${slug}`, {headers : {Authorization : token}})
    return res.data.room.id;
  } catch (error) {
    console.log(error);
  }
}

const page = async ({params, searchParams} : {params : {slug : string}; searchParams : {token : string}}) => {

    const { slug } = await params
    const {token} = await searchParams

    console.log(slug, token);
    const roomId = await getRoom(slug, token);
  return (
    <RoomCanvas id = {roomId}  />
  )
}

export default page