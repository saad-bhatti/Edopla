import Button from "@mui/joy/Button";
import DialogTitle from "@mui/joy/DialogTitle";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import { useState } from "react";

/** Props of the custom filter component. */
interface CustomFilterProps {
  filterOptions: any[];
  onApply: any;
  onRemove: any;
  variant: "outlined" | "plain" | "soft" | "solid";
  color: "primary" | "success" | "warning" | "neutral";
}

/** UI component for a custom filter. */
const CustomFilter = ({ filterOptions, onApply, onRemove,variant, color }: CustomFilterProps) => {
  // State to control whether the filter options are visible or not.
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  /** UI layout for the custom filter. */
  return (
    <>
      {/* Filter button that is always visible. */}
      <Button variant={variant} color={color} onClick={() => setIsVisible(true)}>
        Filters
      </Button>

      {/* Filter options that are hidden by default. */}
      <Drawer open={isVisible} onClose={() => setIsVisible(false)}>
        <Stack useFlexGap spacing={3} sx={{ p: 2 }}>
          {/* Title. */}
          <DialogTitle>Filters</DialogTitle>

          {/* Close button. */}
          <ModalClose />

          {/* Filter options. */}
          {filterOptions.map((element, index) => (
            <div key={index}>{element}</div>
          ))}
        </Stack>

        {/* Button to apply or remove filters. */}
        <Button
        variant="solid"
        color="primary"
        onClick={() => {
          !isActive ? onApply() : onRemove();
          setIsActive(!isActive);
          setIsVisible(false);
        }}
        sx={{ alignSelf: "flex-end", marginRight: "2%", minWidth: "fit-content" }}
        >
          {!isActive ? "Apply" : "Remove"}
        </Button>
      </Drawer>
    </>
  );
};

export default CustomFilter;
