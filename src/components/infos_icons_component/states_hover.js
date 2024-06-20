import { useState} from 'react';

// logica de mudança de estado hover
export  const States_hover = () =>{
const [isCreditCardHovered, setIsCreditCardHovered] = useState(false);
const [isClockHovered, setIsClockHovered] = useState(false);
const [isInfoHovered, setIsInfoHovered] = useState(false);
return{
    isCreditCardHovered, 
    setIsCreditCardHovered,
    isClockHovered,
    setIsClockHovered,
    isInfoHovered,
    setIsInfoHovered
}

}


