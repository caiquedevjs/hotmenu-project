// SizeDevice.js (por exemplo)
import  { useEffect, useState } from "react";

export const Size_device = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // O array vazio [] garante que o useEffect só será executado uma vez, após a montagem inicial

    const iconSize = windowWidth <= 768 ? 20 : 40; 

    return {
        windowWidth,
        iconSize
    };
};
