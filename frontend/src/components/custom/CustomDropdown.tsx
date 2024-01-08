/**************************************************************************************************
 * This file contains the UI for the custom dropdown component.                                   *
 * This component is used to create a dropdown with the provided options that execute a specific  *
 * function when clicked.                                                                         *
 **************************************************************************************************/

import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";

/** Props of the custom dropdown component. */
interface CustomDropdownProps {
  label: string;
  options: string[]; // Array of strings to display as options.
  onOptionClick: ((() => void) | null)[]; // Array of functions to handle the click of each option.
  variant?: "outlined" | "plain" | "soft" | "solid";
  color?: "primary" | "success" | "warning";
  sx?: SxProps;
}

/** UI component for a custom dropdown. */
const CustomDropdown = ({
  label,
  options,
  onOptionClick,
  variant,
  color,
  sx,
}: CustomDropdownProps) => {
  // State to track the current selected index.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  // Custom styling for the dropdown.
  const customSx: SxProps = {
    ...sx,
    whiteSpace: "nowrap",
  };

  /** UI layout for the custom dropdown. */
  return (
    <Dropdown>
      <MenuButton variant={variant} color={color} endDecorator={<ArrowDropDown />} sx={customSx}>
        {label}
      </MenuButton>
      <Menu sx={{ minWidth: 120 }}>
        {options.map((option, index) => (
          <MenuItem
            key={index}
            selected={selectedIndex === index}
            onClick={() => {
              if (onOptionClick[index] !== null) {
                setSelectedIndex(index); // Update the selected index.
                onOptionClick[index]?.(); // Execute the corresponding function.
              }
            }}
            disabled={onOptionClick[index] === null}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
