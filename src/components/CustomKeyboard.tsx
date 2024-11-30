// src/components/CustomKeyboard.tsx
import React from "react";

interface ButtonConfig {
  label: string;
  value: string;
}

const CustomKeyboard = () => {
  //   const buttons: ButtonConfig[] = [
  //     { label: "q", value: "q" },
  //     { label: "w", value: "w" },
  //     { label: "e", value: "e" },
  //     { label: "r", value: "r" },
  //     { label: "t", value: "t" },
  //     { label: "y", value: "y" },
  //     { label: "u", value: "u" },
  //     { label: "i", value: "i" },
  //     { label: "o", value: "o" },
  //     { label: "p", value: "p" },
  //     { label: "a", value: "a" },
  //     { label: "s", value: "s" },
  //     { label: "d", value: "d" },
  //     { label: "f", value: "f" },
  //     { label: "g", value: "g" },
  //     { label: "h", value: "h" },
  //     { label: "j", value: "j" },
  //     { label: "k", value: "k" },
  //     { label: "l", value: "l" },
  //     { label: "θ", value: "θ" },
  //     { label: "z", value: "z" },
  //     { label: "x", value: "x" },
  //     { label: "c", value: "c" },
  //     { label: "v", value: "v" },
  //     { label: "b", value: "b" },
  //     { label: "n", value: "n" },
  //     { label: "m", value: "m" },
  //     { label: "Shift", value: "Shift" },
  //     { label: "123", value: "123" },
  //     { label: "aᵦ", value: "aᵦ" },
  //     { label: "!", value: "!" },
  //     { label: "%", value: "%" },
  //     { label: "[", value: "[" },
  //     { label: "]", value: "]" },
  //     { label: "{", value: "{" },
  //     { label: "}", value: "}" },
  //     { label: "~", value: "~" },
  //     { label: ",", value: "," },
  //     { label: "Backspace", value: "Backspace" },
  //     { label: "Enter", value: "Enter" },
  //   ];

  return (
    <div className="custom-keyboard">
      {buttons.map((button, index) => (
        <button key={index} onClick={() => onKeyPress(button.value)}>
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default CustomKeyboard;
