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
}

/** UI component for a custom autocomplete. */
const CustomAutoComplete = ({
  label,
  options,
  placeholder,
  defaultValue,
  isOptionEqual,
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
          renderOption={(optionProps, option) => (
            <AutocompleteOption {...optionProps}>{option}</AutocompleteOption>
          )}
        />
      </FormControl>
    </>
  );
};

export default CustomAutoComplete;
