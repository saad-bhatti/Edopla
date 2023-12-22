import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";

/** Props of the custom autocomplete component. */
interface CustomAutoCompleteProps {
  label: string;
  options: any[];
  placeholder: string;
  defaultValue: string;
  isOptionEqual: (option: any, value: any) => boolean;
  onChange: (input: string) => void; // Function to execute when the autocomplete value changes.
}

/** UI component for a custom autocomplete. */
const CustomAutoComplete = ({
  label,
  options,
  placeholder,
  defaultValue,
  isOptionEqual,
  onChange,
}: CustomAutoCompleteProps) => {
  return (
    <>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Autocomplete
          autoHighlight
          options={options}
          placeholder={placeholder}
          defaultValue={defaultValue}
          isOptionEqualToValue={isOptionEqual}
          onChange={(_, input) => {
            if (input === null) onChange("");
            else onChange(input as string);
          }}
          renderOption={(optionProps, option) => (
            <AutocompleteOption {...optionProps}>{option}</AutocompleteOption>
          )}
        />
      </FormControl>
    </>
  );
};

export default CustomAutoComplete;
