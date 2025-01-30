import React from 'react'

interface ButtonProps {
  text: string;
  callback: () => void;
}

const Button = ({ text, callback }: ButtonProps) => {
  return (
    <button onClick={callback} className="bg-theme-primary text-white text-sm px-4 py-2 rounded-lg">
        {text}
    </button>
  )
}

export default Button