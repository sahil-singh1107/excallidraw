import React from 'react'
import { options } from "../utils/index"


const BottomBar = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 py-3 bg-white w-[30%] shadow-lg rounded-md">
      <div className="flex flex-row justify-center">
        <ul className="flex gap-4">
          {options.map((option, i) => (
            <li key={i} className="text-gray-700 hover:text-gray-900 p-1 rounded-sm cursor-pointer hover:bg-slate-200" title={option.name}>
              <option.icon/>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BottomBar
