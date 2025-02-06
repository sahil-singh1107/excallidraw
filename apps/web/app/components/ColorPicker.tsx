import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Palette} from "lucide-react";
const colors = [
    "#ffffff", "#1e1e1e", "#0c8599", "#9c36b5", "#c2255c", "#2f9e44", "#e03131"
];

import { Input } from "@/components/ui/input"


const ColorPicker = ({
    backgroundColor,
    setBackgroundColor,
    strokeColor,
    setStrokeColor,
    clicked,
                         colorPickerPosition
}: {
    backgroundColor: string;
    setBackgroundColor: Dispatch<SetStateAction<string>>;
    strokeColor: string, setStrokeColor: Dispatch<SetStateAction<string>>
    clicked : boolean
    colorPickerPosition : {x : number, y : number}
}) => {

    return (

        <Collapsible className={`z-40 transition duration-150`}>
            <CollapsibleTrigger><Palette color="white"/></CollapsibleTrigger>
            <CollapsibleContent>
                <section>
                    <span className="text-white">Background Color</span>
                    <div className="flex gap-2">
                        {
                            colors.map((color,i) => (
                                <div key={i} onClick={() => {
                                    setBackgroundColor(color)
                                }} className="rounded-full w-8 h-8 hover:scale-105 hover:cursor-pointer transition duration-150" style={{backgroundColor : color}} >

                                </div>
                            ))
                        }
                    </div>
                </section>
                <section>
                    <span className="text-white">Stroke</span>
                    <div className="flex gap-2">
                        {
                            colors.map((color, i) => (
                                <div key={i} onClick={() => {
                                    setStrokeColor(color)
                                }} className="rounded-full w-8 h-8 hover:scale-105 hover:cursor-pointer transition duration-150" style={{backgroundColor: color}}>
                                </div>
                            ))
                        }
                    </div>
                </section>
            </CollapsibleContent>
        </Collapsible>

    );
};

export default ColorPicker;
