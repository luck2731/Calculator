import { buttonInterface } from "../utils/interface";

const Button = ({
  buttons,
  handleButtonClick,
}: {
  buttons: buttonInterface[];
  handleButtonClick: (value: string) => void;
}) => {
  return buttons.map((button, index) => (
    <button
      key={index}
      onClick={() =>
        button.action ? button.action() : handleButtonClick(button.value)
      }>
      {button.icon ? (
        <img src={button.icon} alt={button.label} />
      ) : (
        button.label
      )}
    </button>
  ));
};

export default Button;
