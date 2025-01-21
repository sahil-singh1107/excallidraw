import {
    SidebarProvider
} from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebat"
import { Dispatch, SetStateAction } from "react"

const Sidebar = ({setSelected, selected} : {setSelected : Dispatch<SetStateAction<string>>, selected : string}) => {
    return <SidebarProvider>
        <AppSidebar setSelected = {setSelected} selected = {selected}  />  
    </SidebarProvider>

}

export default Sidebar
