"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"


import { options } from "@/utils"
import { Dispatch, SetStateAction, useState } from "react"

export function AppSidebar({ setSelected, selected }: { setSelected: Dispatch<SetStateAction<string>>, selected: string }) {

    return (
        <Sidebar className="w-[5%] h-fit m-3 hover:scale-105 transition duration-100 z-40" variant="floating" collapsible="offcanvas">
            <SidebarContent className="bg-black rounded-lg">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="items-center ">
                            {options.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild className="transition duration-150">
                                        <item.icon className={`w-8 h-8 ${selected === item.name && "bg-[#18191a]"} hover:bg-[#18191a] focus:bg-[#18191a]`} color="white" onClick={() => {
                                            setSelected(item.name)
                                        }} />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}