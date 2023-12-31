import Input from "@mui/joy/Input";
import { SxProps } from "@mui/joy/styles/types";

/** Props of the custom input component. */
interface CustomInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startDecorator?: React.ReactNode;
  required?: boolean;
  error?: boolean;
  ariaLabel?: string;
  sx?: SxProps;
}

/** UI component for a custom input. */
const CustomInput = ({
  type,
  placeholder,
  value,
  onChange,
  startDecorator,
  required,
  error,
  ariaLabel,
  sx,
}: CustomInputProps) => {
  const customSX = { ...sx, border: "none", outline: "none" };

  /** UI layout for the custom input. */
  return (
    <Input
      variant="plain"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      startDecorator={startDecorator}
      required={required}
      error={error}
      aria-label={ariaLabel}
      sx={customSX}
    />
  );
};

export default CustomInput;
