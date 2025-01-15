
import axios from "axios"
import ChatRoom from "../../components/ChatRoom";

async function getRoom (slug : string) {
  try {
    const res = await axios.get(`http://localhost:3001/api/v1/room/rooms/${slug}`, {headers : {Authorization : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczNjgwMjI5Nn0.pt4HDL36dux6J2kPx96ei4nM5HpoIvOLyR40lcl8uPQ"}})
    return res.data.room.id;
  } catch (error) {
    console.log(error);
  }
}

const page = async ({params} : {params : {slug : string}}) => {

    const { slug } = await params

    const roomId = await getRoom(slug);

  return (
    <ChatRoom id = {roomId} />
  )
}

export default page
