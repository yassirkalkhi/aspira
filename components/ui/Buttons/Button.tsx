import React from 'react';

interface ButtonProps {
    text: string;
    callback: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, callback }) => {
    return (
        <button onClick={callback} className='bg-theme-primary text-white rounded-md  py-2 px-3'> 
            {text}
        </button>
    );
}

export default Button;