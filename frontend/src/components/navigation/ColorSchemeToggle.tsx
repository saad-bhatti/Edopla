import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import IconButton from "@mui/joy/IconButton";
import { useColorScheme } from "@mui/joy/styles";
import { useEffect, useState } from "react";

/** UI component for the color scheme toggle. */
const ColorSchemeToggle = () => {
  // Get the current color scheme and the function to change it
  const { colorScheme, setColorScheme } = useColorScheme();
  // State to track whether the component has mounted
  const [mounted, setMounted] = useState(false);

  // Set the component to mounted after the first render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  else
    return (
      <IconButton
        id="toggle-mode"
        size="md"
        variant="plain"
        color="neutral"
        onClick={() => {
          setColorScheme(colorScheme === "light" ? "dark" : "light");
        }}
      >
        {colorScheme === "dark" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    );
};

export default ColorSchemeToggle;
