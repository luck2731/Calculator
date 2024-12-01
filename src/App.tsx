import "./App.css";
import Slider from "./components/slider/Slider";
import { CalculatorProvider } from "./context/CalculatorContext";

function App() {
  return (
    <CalculatorProvider>
      <div className="app-container">
        <div className="app-sidebar">
          <Slider />
        </div>
        <div className="app-main">
          <h1>Formula Calculator</h1>
        </div>
      </div>
    </CalculatorProvider>
  );
}

export default App;
