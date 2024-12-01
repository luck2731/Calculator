import "./Keyboard.css";

interface KeyboardProps {
  isVisible: boolean;
  onKeyPress: (key: string) => void;
}

const Keyboard = ({ isVisible, onKeyPress }: KeyboardProps) => {
  const rightSide = [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "*"],
    ["0", "(", ")", "/"],
    ["^", ".", "backspace"],
  ];

  const leftSide = [
    ["q", "w", "e", "r", "t"],
    ["a", "s", "d", "f", "g"],
    ["z", "x", "c", "v", "b"],
    ["y", "u", "i", "o", "p"],
    ["h", "j", "k", "l", "m"],
    ["n"],
  ];

  return (
    <div className={`keyboard ${isVisible ? "visible" : ""}`}>
      <div className="keyboard-handle">
        <div className="handle-bar"></div>
      </div>
      <div className="keyboard-content">
        <div className="keyboard-left">
          {leftSide.map((row, rowIndex) => (
            <div key={`left-${rowIndex}`} className="keyboard-row">
              {row.map((key, keyIndex) => (
                <button
                  key={`left-${rowIndex}-${keyIndex}`}
                  className="keyboard-key letter-key"
                  onClick={() => onKeyPress(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="keyboard-right">
          {rightSide.map((row, rowIndex) => (
            <div key={`right-${rowIndex}`} className="keyboard-row">
              {row.map((key, keyIndex) => (
                <button
                  key={`right-${rowIndex}-${keyIndex}`}
                  className={`keyboard-key ${
                    key === "backspace"
                      ? "key-wide"
                      : key.match(/^[0-9]$/)
                      ? "number-key"
                      : "operator-key"
                  }`}
                  onClick={() => onKeyPress(key)}
                >
                  {key === "backspace" ? "⌫" : key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
