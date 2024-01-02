import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";
import CustomInput from "./CustomInput";

/** Props of the custom search component. */
interface CustomSearchProps {
  placeholder: string;
  initialValue: string;
  activeSearch: boolean;
  onSearch: (searchValue: string) => void;
  sx?: SxProps;
}

/** UI component for a custom search. */
const CustomSearch = ({
  placeholder,
  initialValue,
  activeSearch,
  onSearch,
  sx,
}: CustomSearchProps) => {
  /** State to track the value of the search bar. */
  const [value, setValue] = useState<string>(initialValue);
  const stackSX = { ...sx, border: "1px solid", borderRadius: "6px" };

  /** UI layout for the custom search. */
  return (
    <Stack direction="row" sx={stackSX}>
      <CustomInput
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = event.target.value;
          setValue(newValue);
          if (activeSearch) onSearch(newValue);
        }}
        startDecorator={<SearchRoundedIcon />}
        aria-label="Search"
        sx={{ flex: 1 }}
      />
      <Button
        variant="plain"
        color="primary"
        onClick={() => {
          onSearch(value);
        }}
      >
        Search
      </Button>
    </Stack>
  );
};

export default CustomSearch;
