import { useState } from "react";
import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
  name: string; // The name of the field
  label: string; // The label of the field
  register: UseFormRegister<any>; // React hook form register function
  registerOptions?: RegisterOptions; // React hook form register options
  value?: string; // The value of the field
  error?: FieldError; // React hook form error object
  [x: string]: any; // any other props
}

const TextInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  value = "",
  ...props
}: TextInputFieldProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        {...register(name, registerOptions)}
        isInvalid={!!error}
        value={inputValue}
        onChange={handleChange}
      />
      <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
