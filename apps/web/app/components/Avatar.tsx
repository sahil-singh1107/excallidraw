import React from "react";

const Avatar = ({ name, color }: { name: string, color : string }) => {
  return (
    <div className="relative group w-0 h-0 bg-transparent">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-[110%] transition duration-200"
        style={{
          backgroundColor: color,
          backdropFilter: "blur(10px)",
          border: "4px solid #55FBA3",
        }}
      >
      </div>
      <span
        className="rounded-md bg-slate-200 p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        {name}
      </span>
    </div>
  );
};

export default Avatar;
