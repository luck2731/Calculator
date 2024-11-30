import React from "react";

interface ResultDisplayProps {
  result: number | string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div>
      <h3>Result: {result}</h3>
    </div>
  );
};

export default ResultDisplay;
