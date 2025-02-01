import React, { Dispatch, SetStateAction } from 'react';

const colors = [
    "#ffffff", "#1e1e1e", "#0c8599", "#9c36b5", "#c2255c", "#2f9e44", "#e03131"
];

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ColorPicker = ({
    backgroundColor,
    setBackgroundColor,
    strokeColor,
    setStrokeColor
}: {
    backgroundColor: string;
    setBackgroundColor: Dispatch<SetStateAction<string>>;
    strokeColor: string, setStrokeColor: Dispatch<SetStateAction<string>>
}) => {
    return (
        <Accordion type="multiple" className="z-40 relative w-fit gap-2">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-white">Color</AccordionTrigger>
                <AccordionContent className="flex gap-2 flex-wrap">
                    {colors.map((color, i) => (
                        <Avatar
                            key={i}
                            className="w-10 h-10 cursor-pointer"
                            onClick={() => setBackgroundColor(color)}
                        >
                            <AvatarFallback style={{ backgroundColor: color }}> </AvatarFallback>
                        </Avatar>
                    ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-white">Stroke</AccordionTrigger>
                <AccordionContent className='flex gap-2 flex-wrap'>
                    {colors.map((color, i) => (
                        <Avatar
                            key={i}
                            className="w-10 h-10 cursor-pointer"
                            onClick={() => setStrokeColor(color)}
                        >
                            <AvatarFallback style={{ backgroundColor: color }}> </AvatarFallback>
                        </Avatar>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ColorPicker;
