import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface FormulaInputProps {
  onFormulaChange: (formula: string) => void;
}

const FormulaInput: React.FC<FormulaInputProps> = ({ onFormulaChange }) => {
  const [formula, setFormula] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormula = e.target.value;
    setFormula(newFormula);
    onFormulaChange(newFormula);
  };

  return (
    <div>
      <InlineMath>{formula}</InlineMath>
      <input
        type="text"
        value={formula}
        onChange={handleChange}
        placeholder="Enter your formula"
      />
    </div>
  );
};

export default FormulaInput;
