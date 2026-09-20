import { ButtonHTMLAttributes } from "react";
export function Button({className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={`min-h-11 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 ${className}`} {...props}/>}
