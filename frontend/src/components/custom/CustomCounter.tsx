import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useState } from "react";
import { SxProps } from "@mui/joy/styles/types";

/** Props of the custom counter component. */
interface CustomCounterProps {
  initialValue: number;
  min?: number;
  max?: number;
  externalCounterChangeHandler?: (updatedCount: number) => void;
  sx?: SxProps;
}

/** UI component for a custom counter. */
const CustomCounter = ({
  initialValue,
  min,
  max,
  externalCounterChangeHandler,
  sx,
}: CustomCounterProps) => {
  /** State to track the value of the counter. */
  const [count, setCount] = useState<number>(initialValue);

  /** Default function to handle the change of the counter value. */
  function internalCounterChangeHandler(updatedCount: number): void {
    if (min !== undefined && updatedCount < min) setCount(min);
    else if (max !== undefined && updatedCount > max) setCount(max);
    else setCount(updatedCount);
  }

  /** UI layout for the custom counter. */
  return (
    <Stack sx={sx}>
      <Input
        placeholder={count.toString()}
        type="number"
        value={count}
        onChange={(event) => {
          const updatedCount = parseInt(event.target.value);
          externalCounterChangeHandler && externalCounterChangeHandler(updatedCount);
          internalCounterChangeHandler(updatedCount);
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
