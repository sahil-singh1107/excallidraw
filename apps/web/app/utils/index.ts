import { Circle, CircleEllipsis, Eraser, Grab, Minus, MousePointer2, Octagon, Pen, Square, TypeOutline, Workflow } from "lucide-react";


export const options = [
    {
        name: "select",
        icon: MousePointer2
    },
    {
        name: "rect",
        icon: Square
    },
    {
        name: "circle",
        icon: Circle
    },
    {
        name: "line",
        icon: Minus
    },
    {
        name: "pen",
        icon: Pen
    },
    {
        name: "text",
        icon: TypeOutline
    },
    {
        name : "polygon",
        icon : Octagon
    },
    {
        name : "eraser",
        icon : Eraser
    },
    {
        name : "grab",
        icon : Grab
    },

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

