import React, { useState } from "react";
import { sliderInterface } from "../utils/interface";

const Slider = ({ value, onChange }: sliderInterface) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <>
      <div className="slider-container">
        <span> {-10}</span>
        <input
          type="range"
          min="-10"
          max="10"
          value={sliderValue}
          onChange={handleSliderChange}
        />
        <span>{10}</span>
      </div>
      <span>
        value for {value} is: {sliderValue}
      </span>
    </>
  );
};

export default Slider;
