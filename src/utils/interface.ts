export interface buttonInterface {
  label: string;
  value: string;
  icon?: string;
  action?: () => void;
}

export interface sliderInterface {
  value: string;
  onChange: (val: number) => void;
}

export interface calculatorInterface {
  handleButtonClick: (value: string) => void;
  isShiftActive: boolean;
}
