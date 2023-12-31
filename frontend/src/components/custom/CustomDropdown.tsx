import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { useState } from "react";

/** Props of the custom dropdown component. */
interface CustomDropdownProps {
  label: string;
  options: string[]; // Array of strings to display as options.
  onOptionClick: (() => void)[]; // Array of functions to handle the click of each option.
  variant?: "outlined" | "plain" | "soft" | "solid";
  color?: "primary" | "success" | "warning";
}

/** UI component for a custom dropdown. */
const CustomDropdown = ({ label, options, onOptionClick, variant, color }: CustomDropdownProps) => {
  // State to track the current selected index.
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  /** UI layout for the custom dropdown. */
  return (
    <Dropdown>
      <MenuButton
        variant={variant}
        color={color}
        endDecorator={<ArrowDropDown />}
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}
      </MenuButton>
      <Menu sx={{ minWidth: 120 }}>
        {options.map((option, index) => (
          <MenuItem
            key={index}
            selected={selectedIndex === index}
            onClick={() => {
              setSelectedIndex(index);  // Update the selected index.
              onOptionClick[index]();   // Execute the corresponding function.
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
