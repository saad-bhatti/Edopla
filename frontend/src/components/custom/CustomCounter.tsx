import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useState } from "react";

/** Props of the custom counter component. */
interface CustomCounterProps {
  initialValue: number;
  min?: number;
  max?: number;
}

/** UI component for a custom counter. */
const CustomCounter = ({ initialValue, min, max }: CustomCounterProps) => {
  /** State to track the value of the counter. */
  const [count, setCount] = useState<number>(initialValue);

  /** Function to handle the change of the counter value. */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const updatedCount = parseInt(event.target.value);
    if (min !== undefined && updatedCount < min) setCount(min);
    else if (max !== undefined && updatedCount > max) setCount(max);
    else setCount(updatedCount);
  }

  /** UI layout for the custom counter. */
  return (
    <Stack>
      <Input
        placeholder={count.toString()}
        type="number"
        value={count}
        onChange={(event) => {
          handleChange(event);
        }}
        size="sm"
        variant="outlined"
        sx={{
          maxWidth: "50px",
          "&:focus-within": {
            outline: "2px solid var(--Input-focusedHighlight)",
            outlineOffset: "2px",
          },
        }}
      />
    </Stack>
  );
};

export default CustomCounter;
