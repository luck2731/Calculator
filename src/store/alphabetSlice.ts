import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Calculator {
  id: string;
  expression: string;
  result: number;
  error: string | null;
}

interface AlphabetState {
  calculators: Calculator[];
  charValues: { [key: string]: number };
}

const initialState: AlphabetState = {
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

const extractVariables = (expression: string): string[] => {
  const matches = expression.match(/[a-zA-Z]/g) || [];
  return [...new Set(matches)];
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
      error: null, // Keep error null to show suggestions
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
    // Safely evaluate the expression
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

export const alphabetSlice = createSlice({
  name: "alphabet",
  initialState,
  reducers: {
    addCalculator: (state) => {
      state.calculators.push({
        id: `calc-${state.calculators.length + 1}`,
        expression: "",
        result: 0,
        error: null,
      });
    },

    setExpression: (
      state,
      action: PayloadAction<{ id: string; expression: string }>
    ) => {
      const calculator = state.calculators.find(
        (calc) => calc.id === action.payload.id
      );
      if (!calculator) return;

      calculator.expression = action.payload.expression;

      const { result, error } = calculateExpression(
        action.payload.expression,
        state.charValues
      );

      calculator.result = result;
      calculator.error = error;
    },

    setCharValue: (
      state,
      action: PayloadAction<{ char: string; value: number }>
    ) => {
      state.charValues[action.payload.char] = action.payload.value;

      // Recalculate all expressions
      state.calculators.forEach((calculator) => {
        const { result, error } = calculateExpression(
          calculator.expression,
          state.charValues
        );
        calculator.result = result;
        calculator.error = error;
      });
    },

    removeVariable: (state, action: PayloadAction<string>) => {
      delete state.charValues[action.payload];

      // Update all calculators
      state.calculators.forEach((calculator) => {
        const newExpression = calculator.expression
          .split("+")
          .filter((term) => term.trim() !== action.payload)
          .join("+");

        const { result, error } = calculateExpression(
          newExpression,
          state.charValues
        );

        calculator.expression = newExpression;
        calculator.result = result;
        calculator.error = error;
      });
    },

    removeCalculator: (state, action: PayloadAction<string>) => {
      state.calculators = state.calculators.filter(
        (calc) => calc.id !== action.payload
      );
    },

    renameVariable: (
      state,
      action: PayloadAction<{ oldChar: string; newChar: string }>
    ) => {
      const { oldChar, newChar } = action.payload;
      if (state.charValues.hasOwnProperty(newChar)) return;

      // Store the value
      const value = state.charValues[oldChar];

      // Create new entry with new name
      state.charValues[newChar] = value;

      // Remove old entry
      delete state.charValues[oldChar];

      // Update expressions
      state.calculators.forEach((calculator) => {
        calculator.expression = calculator.expression
          .split("+")
          .map((term) => (term.trim() === oldChar ? newChar : term))
          .join("+");

        const { result, error } = calculateExpression(
          calculator.expression,
          state.charValues
        );
        calculator.result = result;
        calculator.error = error;
      });
    },
  },
});

export const {
  addCalculator,
  setExpression,
  setCharValue,
  removeVariable,
  removeCalculator,
  renameVariable,
} = alphabetSlice.actions;

export default alphabetSlice.reducer;
