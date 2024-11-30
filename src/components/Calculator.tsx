import { useState, useEffect } from "react";
import "katex/dist/katex.min.css";
import "./Calculator.css";
import Button from "./Button";
import { numericButtons, alphabeticButtons } from "../utils/data";
import { calculatorInterface } from "../utils/interface";

const Calculator = ({
  handleButtonClick,
  isShiftActive,
}: calculatorInterface) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlphabeticButtons, setCurrentAlphabeticButtons] =
    useState(alphabeticButtons);

  useEffect(() => {
    const alphabeticButtonsWithShift = isShiftActive
      ? alphabeticButtons.map((button) => ({
          ...button,
          label: button.label.toUpperCase(),
          value: button.value.toUpperCase(),
        }))
      : alphabeticButtons;
    setCurrentAlphabeticButtons(alphabeticButtonsWithShift);
  }, [isShiftActive]);

  return (
    <div>
      {!isOpen && (
        <button
          className="toggle-calculator bottom-left"
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide Keypad" : "Show Keypad"}
        </button>
      )}
      <div className="calculator-container">
        <div className={`calculator-popup ${isOpen ? "open" : ""}`}>
          {isOpen && (
            <div>
              <button
                className="toggle-true"
                onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Hide Keypad" : "Show Keypad"}
              </button>
            </div>
          )}
          <div className="container">
            <div className="keypad-container">
              <div className="custom-keyboard">
                <Button
                  buttons={currentAlphabeticButtons}
                  handleButtonClick={handleButtonClick}
                />
              </div>
              <div className="keypad">
                <Button
                  buttons={numericButtons}
                  handleButtonClick={handleButtonClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
