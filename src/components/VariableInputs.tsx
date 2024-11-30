import React from "react";

interface VariableInputsProps {
  variables: string[];
  onVariableChange: (variable: string, value: number) => void;
}

const VariableInputs: React.FC<VariableInputsProps> = ({
  variables,
  onVariableChange,
}) => {
  return (
    <div>
      {variables.map((variable) => (
        <div key={variable}>
          <label>{variable}: </label>
          <input
            type="number"
            onChange={(e) =>
              onVariableChange(variable, parseFloat(e.target.value))
            }
          />
        </div>
      ))}
    </div>
  );
};

export default VariableInputs;
