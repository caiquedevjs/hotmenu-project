
import  { useEffect, useState } from "react";

export const Size_device = () => {
    // <------- estado no tamanho do dispostivo ------->
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    
    // <------- logica de alterar o tamanho do icon em dispostivo moveis ------->
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // <-----------O array vazio [] garante que o useEffect só será executado uma vez, após a montagem inicial----------->

    const iconSize = windowWidth <= 768 ? 30 : 40; 

    return {
        windowWidth,
        iconSize
    };
};
