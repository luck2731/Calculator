import { useState, useRef, useEffect } from "react";
import { useCalculator } from "../../context/CalculatorContext";
import "./Slider.css";
import Keyboard from "../keyboard/Keyboard";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const Slider = () => {
  const { state, dispatch } = useCalculator();
  const [itemOrder, setItemOrder] = useState<
    Array<{ type: "variable" | "calculator"; id: string }>
  >([]);

  // Initialize itemOrder with the first calculator
  useEffect(() => {
    if (state.calculators.length > 0 && itemOrder.length === 0) {
      setItemOrder([{ type: "calculator", id: state.calculators[0].id }]);
    }
  }, []);

  const handleAddCalculator = () => {
    const newCalcId = `calc-${state.calculators.length + 1}`;
    dispatch({ type: "ADD_CALCULATOR" });
    setItemOrder((prev) => [...prev, { type: "calculator", id: newCalcId }]);
  };

  const handleAddVariable = (charToAdd?: string) => {
    // Check if variable already exists in itemOrder
    if (
      charToAdd &&
      itemOrder.some(
        (item) => item.type === "variable" && item.id === charToAdd
      )
    ) {
      return; // Skip if variable already exists
    }

    // If a specific character is provided, use it
    if (typeof charToAdd === "string") {
      dispatch({
        type: "SET_CHAR_VALUE",
        payload: { char: charToAdd, value: 1 },
      });
      setItemOrder((prev) => [...prev, { type: "variable", id: charToAdd }]);
      return;
    }

    // Otherwise, find the next available character
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const usedChars = Object.keys(state.charValues);
    const newChar = alphabet
      .split("")
      .find((char) => !usedChars.includes(char));

    if (
      newChar &&
      !itemOrder.some((item) => item.type === "variable" && item.id === newChar)
    ) {
      dispatch({
        type: "SET_CHAR_VALUE",
        payload: { char: newChar, value: 1 },
      });
      setItemOrder((prev) => [...prev, { type: "variable", id: newChar }]);
    }
  };

  // Update handleRemoveVariable to properly clean up
  const handleRemoveVariable = (char: string) => {
    dispatch({ type: "REMOVE_VARIABLE", payload: char });
    setItemOrder((prev) =>
      prev.filter((item) => !(item.type === "variable" && item.id === char))
    );
  };

  // Add handleRenameVariable function
  const handleRenameVariable = (oldChar: string, newChar: string) => {
    if (!state.charValues.hasOwnProperty(newChar)) {
      // Update itemOrder first
      setItemOrder((prev) =>
        prev.map((item) =>
          item.type === "variable" && item.id === oldChar
            ? { ...item, id: newChar }
            : item
        )
      );

      // Then dispatch rename action
      dispatch({ type: "RENAME_VARIABLE", payload: { oldChar, newChar } });
    }
  };

  // Clean up removed items and ensure no duplicates
  const validItemOrder = itemOrder.filter(
    (item, index, self) =>
      // Remove duplicates
      index ===
        self.findIndex((t) => t.id === item.id && t.type === item.type) &&
      // Check if item still exists in state
      (item.type === "calculator"
        ? state.calculators.some((calc) => calc.id === item.id)
        : state.charValues.hasOwnProperty(item.id))
  );

  return (
    <div className="calculator-container">
      <div className="add-menu-box">
        <div className="add-menu-header">
          <span>Add New</span>
        </div>
        <div className="add-menu-items">
          <button className="add-menu-item" onClick={handleAddVariable}>
            <span className="add-menu-icon">𝑥</span>
            <div className="add-menu-text">
              <span className="add-menu-title">New Variable</span>
              <span className="add-menu-description">
                Add a new variable slider
              </span>
            </div>
          </button>
          <button className="add-menu-item" onClick={handleAddCalculator}>
            <span className="add-menu-icon">🧮</span>
            <div className="add-menu-text">
              <span className="add-menu-title">New Calculation</span>
              <span className="add-menu-description">
                Add a new calculation box
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Use validItemOrder to render items in sequence */}
      {validItemOrder.map((item, index) => (
        <div key={item.id} className="numbered-container">
          <div className="sequence-number">{index + 1}</div>
          {item.type === "variable" ? (
            <VariableSlider
              char={item.id}
              onRemove={handleRemoveVariable}
              onRename={handleRenameVariable} // Pass the rename handler
            />
          ) : (
            <CalculatorBox
              calculatorId={item.id}
              onAddVariable={handleAddVariable}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Update VariableSlider component
const VariableSlider = ({
  char,
  onRemove,
  onRename,
}: {
  char: string;
  onRemove: (char: string) => void;
  onRename: (oldChar: string, newChar: string) => void;
}) => {
  const { state, dispatch } = useCalculator();
  const [editingName, setEditingName] = useState(char);
  const [editingValue, setEditingValue] = useState(state.charValues[char] || 1);

  useEffect(() => {
    setEditingName(char);
    setEditingValue(state.charValues[char] || 1);
  }, [char, state.charValues[char]]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 10) {
      setEditingValue(value);
      dispatch({ type: "SET_CHAR_VALUE", payload: { char, value } });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setEditingValue(value);
    dispatch({ type: "SET_CHAR_VALUE", payload: { char, value } });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value.toLowerCase());
  };

  const handleNameBlur = () => {
    if (editingName !== char && editingName.match(/^[a-z]$/)) {
      onRename(char, editingName);
    }
    setEditingName(char);
  };

  return (
    <div className="input-group">
      <div className="variable-header">
        <input
          type="text"
          value={editingName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          maxLength={1}
          className="variable-name-input"
        />
        <span className="equals-sign">=</span>
        <input
          type="number"
          min="1"
          max="10"
          value={editingValue}
          onChange={handleValueChange}
          className="value-input"
        />
        <button className="close-button" onClick={() => onRemove(char)}>
          ×
        </button>
      </div>
      <div className="slider-row">
        <input
          type="range"
          min="1"
          max="10"
          value={editingValue}
          onChange={handleSliderChange}
          className="char-slider"
        />
      </div>
      <div className="slider-labels">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
};

// Updated Calculator Box Component
const CalculatorBox = ({
  calculatorId,
  onAddVariable,
}: {
  calculatorId: string;
  onAddVariable: (char: string) => void;
}) => {
  const { state, dispatch } = useCalculator();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const calculator = state.calculators.find((calc) => calc.id === calculatorId);
  if (!calculator) return null;

  const handleExpressionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({
      type: "SET_EXPRESSION",
      payload: { id: calculatorId, expression: value },
    });
  };

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      const newExpression = calculator.expression.slice(0, -1);
      dispatch({
        type: "SET_EXPRESSION",
        payload: { id: calculatorId, expression: newExpression },
      });
    } else {
      dispatch({
        type: "SET_EXPRESSION",
        payload: {
          id: calculatorId,
          expression: calculator.expression + key,
        },
      });
    }
    // Keep focus on input after key press
    inputRef.current?.focus();
  };

  // Get undefined variables from the expression
  const getUndefinedVariables = () => {
    const matches = calculator.expression.match(/[a-zA-Z]/g) || [];
    const uniqueVars = [...new Set(matches)];
    return uniqueVars.filter((char) => !state.charValues.hasOwnProperty(char));
  };

  const undefinedVars = getUndefinedVariables();

  const formatLatex = (expression: string): string => {
    if (!expression) return "";

    // Replace operators with LaTeX equivalents
    let latex = expression
      .replace(/\*/g, "\\cdot ")
      .replace(/\//g, "\\div ")
      .replace(/\^/g, "^{")
      .replace(/\+/g, "+")
      .replace(/\-/g, "-");

    // Add closing brace for powers if needed
    if (latex.includes("^{")) {
      latex = latex + "}";
    }

    // Add variable values as subscripts
    Object.entries(state.charValues).forEach(([char, value]) => {
      const regex = new RegExp(char, "g");
      latex = latex.replace(regex, `${char}_{${value}}`);
    });

    return latex;
  };

  return (
    <div className="slider-container">
      <div className="expression-section">
        <div className="expression-header">
          {calculator.expression && (
            <div className="latex-display">
              <InlineMath math={formatLatex(calculator.expression)} />
            </div>
          )}
          <div className="expression-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={calculator.expression}
              onChange={handleExpressionChange}
              onFocus={() => setShowKeyboard(true)}
              placeholder="Type expression (e.g., a*b+10^2)"
              className="expression-input"
              autoComplete="off"
              spellCheck="false"
            />
            {!calculator.error && calculator.result !== 0 && (
              <div className="inline-result">= {calculator.result}</div>
            )}
          </div>
          {calculator.error && (
            <div className="error-message">{calculator.error}</div>
          )}
          {undefinedVars.length > 0 && (
            <div className="variable-suggestions">
              add slider:{" "}
              {undefinedVars.map((char) => (
                <button
                  key={char}
                  onClick={() => onAddVariable(char)}
                  className="suggest-variable-btn"
                >
                  {char}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Keyboard isVisible={showKeyboard} onKeyPress={handleKeyPress} />
    </div>
  );
};

export default Slider;
