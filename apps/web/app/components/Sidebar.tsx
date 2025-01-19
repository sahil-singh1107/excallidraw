import React, { Dispatch, SetStateAction } from 'react'
import { colors, backgrounds } from "../utils/index"

const Sidebar = ({strokeColor, setStrokeColor, backgroundColor, setBackgroundColor} : {strokeColor : string, setStrokeColor : Dispatch<SetStateAction<string>>, backgroundColor : string, setBackgroundColor : Dispatch<SetStateAction<string>>}) => {
    return (
        <div className='fixed z-20 w-[13%] h-[60%] bg-white shadow-lg rounded-md top-1/2 left-10 transform -translate-y-1/2 pt-3 pl-3 space-y-4'>
            <section>
                <p>Stroke</p>
                <ul className='flex space-x-1 overflow-x-auto'>
                    {
                        colors.map((color, i) => (
                            <li key={i} className='h-8 w-8 rounded-sm cursor-pointer' style={{ backgroundColor: color }} onClick={() => {setStrokeColor(color)}}>
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section>
                <p>Background</p>
                <ul className='flex space-x-1 overflow-x-auto'>
                    {
                        backgrounds.map((color, i) => (
                            <li key={i} className='h-8 w-8 rounded-sm cursor-pointer' style={{ backgroundColor: color }} onClick={() => {setBackgroundColor(color)}}>
                            </li>
                        ))
                    }
                </ul>
            </section>
            <section>
                <p>Stroke Width</p>
            </section>
        </div>
    )
}

export default Sidebar
