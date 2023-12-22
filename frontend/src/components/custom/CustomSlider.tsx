import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Slider, { sliderClasses } from "@mui/joy/Slider";

/** Props of the custom slider component. */
interface CustomSliderProps {
  label: string;
  defaultValue: number[];
  step: number;
  min: number;
  max: number;
  marks: { value: number; label: string }[];
  onChange: (value: number[]) => void; // Function to execute when the slider value changes.
}

/** UI component for a custom slider. */
const CustomSlider = ({
  label,
  defaultValue,
  step,
  min,
  max,
  marks,
  onChange,
}: CustomSliderProps) => {
  /**
   * Function to format the price value for the slider.
   * @param price The value of the slider.
   * @returns The formatted price value.
   */
  function formatSliderPrice(price: number): string {
    return `$${price.toLocaleString("en-US")}`;
  }

  /** UI layout for the custom slider. */
  return (
    <>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Slider
          defaultValue={defaultValue}
          step={step}
          min={min}
          max={max}
          getAriaValueText={formatSliderPrice}
          valueLabelDisplay="auto"
          valueLabelFormat={formatSliderPrice}
          marks={marks}
          onChange={(_, values) => {
            onChange(values as number[]);
          }}
          sx={{
            [`& .${sliderClasses.markLabel}[data-index="0"]`]: {
              transform: "none",
            },
            [`& .${sliderClasses.markLabel}[data-index="2"]`]: {
              transform: "translateX(-100%)",
            },
          }}
        />
      </FormControl>
    </>
  );
};

export default CustomSlider;
