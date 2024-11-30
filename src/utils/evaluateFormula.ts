export function evaluateFormula(expression: string): number {
  // Tokenize the expression
  const tokens = expression.match(/(\d+\.?\d*|\+|\-|\*|\/|\^|\(|\))/g);
  if (!tokens) throw new Error("Invalid expression");

  // Helper function to apply an operator to two operands
  const applyOperator = (operator: string, b: number, a: number): number => {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
      case "^":
        return Math.pow(a, b);
      default:
        throw new Error("Unsupported operator");
    }
  };

  // Operator precedence
  const precedence: { [key: string]: number } = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
  };

  // Shunting Yard Algorithm to convert infix to postfix
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  tokens.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      // If the token is a number, add it to the output queue
      outputQueue.push(token);
    } else if (token in precedence) {
      // If the token is an operator, pop operators from the stack to the output queue
      while (
        operatorStack.length &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.pop(); // Remove the '(' from the stack
    }
  });

  // Pop all the remaining operators from the stack to the output queue
  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop()!);
  }

  // Evaluate the postfix expression
  const evaluationStack: number[] = [];
  outputQueue.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      evaluationStack.push(parseFloat(token));
    } else {
      const b = evaluationStack.pop()!;
      const a = evaluationStack.pop()!;
      evaluationStack.push(applyOperator(token, b, a));
    }
  });

  return evaluationStack[0];
}
