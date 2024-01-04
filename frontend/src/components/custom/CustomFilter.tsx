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
const CustomFilter = ({ filterOptions, onApply, onRemove, variant, color }: CustomFilterProps) => {
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

        {/* Buttons to apply or remove filters. */}
        <Stack gap={0.5} direction="row" alignSelf="flex-end" mr="2%" minWidth="fit-content">
          <Button
            variant="soft"
            color="warning"
            onClick={() => {
              onRemove();
              setIsActive(false);
              setIsVisible(false);
            }}
            disabled={!isActive}
          >
            Remove
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              onApply();
              setIsActive(true);
              setIsVisible(false);
            }}
          >
            Apply
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default CustomFilter;
