import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { useState } from "react";

/** Props of the custom search component. */
interface CustomSearchProps {
  placeholder: string;
  initialValue: string;
  activeSearch: boolean;
  onSearch: (searchValue: string) => void;
}

/** UI component for a custom search. */
const CustomSearch = ({ placeholder, initialValue, activeSearch, onSearch }: CustomSearchProps) => {
  /** State to track the value of the search bar. */
  const [value, setValue] = useState<string>(initialValue);

  /** UI layout for the custom search. */
  return (
    <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
      <FormControl sx={{ flex: 1 }}>
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            const newValue = event.target.value;
            setValue(newValue);
            if (activeSearch) onSearch(newValue);
          }}
          startDecorator={<SearchRoundedIcon />}
          aria-label="Search"
        />
      </FormControl>
      <Button
        variant="solid"
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
