import React, { Dispatch, SetStateAction } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const colors = [
    "#ffffff", "#1e1e1e", "#0c8599", "#9c36b5", "#c2255c", "#2f9e44", "#e03131"
];

const ColorPicker = ({
    backgroundColor,
    setBackgroundColor,

}: {
    backgroundColor: string,
    setBackgroundColor: Dispatch<SetStateAction<string>>,

}) => {
    return (
        <Card className="bg-black z-40 relative w-fit p-2">
            <CardContent className="flex">
                {colors.map((color, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setBackgroundColor(color);

                        }}
                        className={`rounded-full w-10 h-10 cursor-pointer 
                            transition-all border border-gray-300 
                            hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 
                            ${backgroundColor === color && "ring-2 ring-offset-2 ring-blue-500"}`}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </CardContent>
        </Card>
    );
};

export default ColorPicker;
