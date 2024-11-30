// src/App.tsx
import React, { useState, useEffect } from "react";
// import FormulaInput from "./components/FormulaInput";
// import VariableInputs from "./components/VariableInputs";
// import ResultDisplay from "./components/ResultDisplay";
// import { evaluateFormula } from "./utils/evaluateFormula";
import Calculator from "./components/Calculator";
import "./App.css";
import Slider from "./components/Slider";
import { InlineMath } from "react-katex";
import { evaluateExpression } from "./components/evaluateExpression";

const App: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [addSlider, setAddSlider] = useState([]);
  const [visibleSliders, setVisibleSliders] = useState<Set<string>>(new Set());
  const [isShiftActive, setIsShiftActive] = useState(false);

  const handleButtonClick = (value: string) => {
    if (value === "Backspace" || value === "BACKSPACE") {
      setExpression((prev) => {
        const newExpression = prev.slice(0, -1);
        const lastChar = prev.slice(-1);

        // Remove the last character from addSlider if it exists
        if (addSlider.includes(lastChar)) {
          setAddSlider((prevSlider) =>
            prevSlider.filter((item) => item !== lastChar)
          );
        }
        return newExpression;
      });
    } else if (value === "Shift" || value === "SHIFT") {
      setIsShiftActive((prev) => !prev); // Toggle shift state
    } else if (/^[a-zA-Z]$/.test(value)) {
      if (!addSlider.includes(value)) {
        setAddSlider([...addSlider, value]);
      }
      setExpression((prev) => prev + value);
    } else {
      setExpression((prev) => prev + value);
    }
  };

  const handleEvaluate = () => {
    try {
      const evaluatedResult = evaluateExpression(expression);
      setResult(evaluatedResult.toString());
    } catch {
      setResult("Error");
    }
  };

  useEffect(() => {
    const hasAlphabeticCharacter = /[a-zA-Z]/.test(expression);
    const isCompleteExpression = /(\d+\.?\d*)([+\-*/^])(\d+\.?\d*)$/.test(
      expression
    );
    console.log(expression);
    if (hasAlphabeticCharacter) {
      setResult("");
    } else if (isCompleteExpression) {
      handleEvaluate();
    } else {
      setResult("");
    }
  }, [expression]);

  const handleSliderValueClick = (value: string) => {
    // console.log("visibleSliders", value);
    setVisibleSliders((prev) => {
      const newSet = new Set(prev);
      newSet.add(value);
      console.log("newSet", newSet);
      return newSet;
    });
  };

  console.log("visibleSliders", visibleSliders);
  return (
    <div className="root">
      <div className="sidebar">
        <div className="display">
          <InlineMath>{expression}</InlineMath>
          {result && (
            <div className="result">
              <InlineMath>{`= ${result}`}</InlineMath>
            </div>
          )}
        </div>
        {addSlider.length > 0 && (
          <div className="add-slider">
            add slider:
            {addSlider.map((sliderValue, index) => (
              <div
                key={index}
                className="add-slider-item"
                onClick={() => handleSliderValueClick(sliderValue)}>
                <span>{sliderValue}</span>
                {visibleSliders.has(sliderValue) && (
                  <Slider
                    value={sliderValue}
                    onChange={(val) =>
                      console.log(`Value for ${sliderValue}: ${val}`)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="name-container">
        <h1>Formula Calculator</h1>
      </div>
      <Calculator
        handleButtonClick={handleButtonClick}
        isShiftActive={isShiftActive}
      />
      {/* <FormulaInput onFormulaChange={handleFormulaChange} />
      <VariableInputs
        variables={variables}
        onVariableChange={handleVariableChange}
      />
      <ResultDisplay result={result} /> */}
    </div>
  );
};

export default App;
