import React, { useEffect, useState } from "react";

const AnimatedText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 50); // Adjust typing speed here (milliseconds)

    return () => clearTimeout(timer); // Clear timeout on unmount or text change
  }, [text, currentIndex]);

  return <span>{displayedText}</span>;
};

export default AnimatedText;
