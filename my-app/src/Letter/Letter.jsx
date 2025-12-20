import React,{useState}from "react";
import LetterModal from "./LetterModal/LetterModal";



const Letter = () => {
  const [isVisible, setIsVisible] =useState(false);

  const onClick = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className="letter-container">
    <button className="bonus-letter" onClick={onClick} >
      🔄
    </button>
    {isVisible && <LetterModal />}
    </div>
  );
};

export default Letter;
