import { LiaMousePointerSolid } from "react-icons/lia";
import { RiRectangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { TiPen } from "react-icons/ti";
import { CiText } from "react-icons/ci";
import { PiPolygonBold } from "react-icons/pi";
export const options = [
    {
        name: "select",
        icon: LiaMousePointerSolid
    },
    {
        name: "rect",
        icon: RiRectangleLine
    },
    {
        name: "circle",
        icon: FaRegCircle
    },
    {
        name: "line",
        icon: IoAnalyticsOutline
    },
    {
        name: "pen",
        icon: TiPen
    },
    {
        name: "text",
        icon: CiText
    },
    {
        name : "polygon",
        icon : PiPolygonBold
    }
]

export const colors = ["#1f1e1f", "#E03030", "#2F9E44", "#1971C2", "#F18D00", "#white"]

export const backgrounds = ["#FFC8C8", "#B3F2BA", "#A4D8FE", "#FFED98", "white"];

export const fillStyle = [{
    name: "solid",
    src: "/bgcolors/solid.png"
},
{
    name: "dots",
    src : "/bgcolors/dots.png"
},
{
    name: "cross-hatch",
    src : "/bgcolors/crosshatch.png"
}
];

