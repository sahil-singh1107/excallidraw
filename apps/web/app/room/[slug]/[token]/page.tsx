
import axios from "axios"
import ChatRoom from "../../../components/ChatRoom";

async function getRoom (slug : string, token : string) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/room/rooms/${slug}`, {headers : {Authorization : token}})
    return res.data.room.id;
  } catch (error) {
    console.log(error);
  }
}

const page = async ({params} : {params : {slug : string, token : string}}) => {

    const { slug, token } = await params

    const roomId = await getRoom(slug, token);

  return (
    <ChatRoom id = {roomId} token = {token} />
  )
}

export default page
