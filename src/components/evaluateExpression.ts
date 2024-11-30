export function evaluateExpression(expression: string): number {
  const tokens = expression.match(/(\d+\.?\d*|\+|-|\*|\/|\^|\(|\))/g);
  if (!tokens) throw new Error("Invalid expression");

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

  const precedence: { [key: string]: number } = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
  };

  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  tokens.forEach((token) => {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(token);
    } else if (token in precedence) {
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
      operatorStack.pop();
    }
  });

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop()!);
  }

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
