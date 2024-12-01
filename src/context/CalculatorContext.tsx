import React, { createContext, useContext, useReducer } from "react";

interface Calculator {
  id: string;
  expression: string;
  result: number;
  error: string | null;
}

interface CalculatorState {
  calculators: Calculator[];
  charValues: { [key: string]: number };
}

type CalculatorAction =
  | { type: "ADD_CALCULATOR" }
  | { type: "SET_EXPRESSION"; payload: { id: string; expression: string } }
  | { type: "SET_CHAR_VALUE"; payload: { char: string; value: number } }
  | { type: "REMOVE_VARIABLE"; payload: string }
  | { type: "REMOVE_CALCULATOR"; payload: string }
  | { type: "RENAME_VARIABLE"; payload: { oldChar: string; newChar: string } };

const initialState: CalculatorState = {
  calculators: [
    {
      id: "calc-1",
      expression: "",
      result: 0,
      error: null,
    },
  ],
  charValues: {},
};

const calculateExpression = (
  expression: string,
  charValues: { [key: string]: number }
): { result: number; error: string | null } => {
  if (!expression) {
    return { result: 0, error: null };
  }

  const cleanExpr = expression.replace(/\s+/g, "");

  // First check for undefined variables
  const matches = cleanExpr.match(/[a-zA-Z]/g) || [];
  const undefinedVars = [...new Set(matches)].filter(
    (char) => !charValues.hasOwnProperty(char)
  );

  if (undefinedVars.length > 0) {
    return {
      result: 0,
      error: null,
    };
  }

  // Replace variables with their values
  let evaluableExpr = cleanExpr;
  Object.entries(charValues).forEach(([char, value]) => {
    evaluableExpr = evaluableExpr.replace(
      new RegExp(char, "g"),
      value.toString()
    );
  });

  try {
    const result = Function(`'use strict'; return (${evaluableExpr})`)();

    if (typeof result !== "number" || !isFinite(result)) {
      return {
        result: 0,
        error: "Invalid calculation result",
      };
    }

    return {
      result: result,
      error: null,
    };
  } catch (error) {
    return {
      result: 0,
      error: "Invalid expression. Use valid arithmetic operations",
    };
  }
};

const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState => {
  switch (action.type) {
    case "ADD_CALCULATOR":
      return {
        ...state,
        calculators: [
          ...state.calculators,
          {
            id: `calc-${state.calculators.length + 1}`,
            expression: "",
            result: 0,
            error: null,
          },
        ],
      };

    case "SET_EXPRESSION": {
      const newCalculators = state.calculators.map((calc) =>
        calc.id === action.payload.id
          ? {
              ...calc,
              expression: action.payload.expression,
              ...calculateExpression(
                action.payload.expression,
                state.charValues
              ),
            }
          : calc
      );
      return {
        ...state,
        calculators: newCalculators,
      };
    }

    case "SET_CHAR_VALUE": {
      const newCharValues = {
        ...state.charValues,
        [action.payload.char]: action.payload.value,
      };

      const newCalculators = state.calculators.map((calc) => ({
        ...calc,
        ...calculateExpression(calc.expression, newCharValues),
      }));

      return {
        ...state,
        charValues: newCharValues,
        calculators: newCalculators,
      };
    }

    case "REMOVE_VARIABLE": {
      const { [action.payload]: _, ...newCharValues } = state.charValues;

      const newCalculators = state.calculators.map((calc) => {
        const newExpression = calc.expression
          .split("+")
          .filter((term) => term.trim() !== action.payload)
          .join("+");

        return {
          ...calc,
          expression: newExpression,
          ...calculateExpression(newExpression, newCharValues),
        };
      });

      return {
        ...state,
        charValues: newCharValues,
        calculators: newCalculators,
      };
    }

    case "RENAME_VARIABLE": {
      const { oldChar, newChar } = action.payload;
      if (state.charValues.hasOwnProperty(newChar)) return state;

      const value = state.charValues[oldChar];
      const { [oldChar]: _, ...restCharValues } = state.charValues;
      const newCharValues = { ...restCharValues, [newChar]: value };

      const newCalculators = state.calculators.map((calc) => {
        const newExpression = calc.expression
          .split("+")
          .map((term) => (term.trim() === oldChar ? newChar : term))
          .join("+");

        return {
          ...calc,
          expression: newExpression,
          ...calculateExpression(newExpression, newCharValues),
        };
      });

      return {
        ...state,
        charValues: newCharValues,
        calculators: newCalculators,
      };
    }

    case "REMOVE_CALCULATOR":
      return {
        ...state,
        calculators: state.calculators.filter(
          (calc) => calc.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
} | null>(null);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
};
