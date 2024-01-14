/**************************************************************************************************                                                                      *
 * This file contains the helper functions for the buy page.                                      *
 * These helper functions are used to generate filter and sort functionality.                     *
 **************************************************************************************************/

import CustomAutoComplete from "../../components/custom/CustomAutoComplete";
import CustomSlider from "../../components/custom/CustomSlider";
import { Vendor } from "../../models/users/vendor";
import * as VendorListManipulation from "../manipulation/VendorListManipulation";

//////////////////////////////////////////// FILTERING /////////////////////////////////////////////
/**
 * Helper function to generate the filter options.
 * @param priceRange The price range of the vendor list. [min, max]
 * @param setPriceRangeFilter The function to update the slider values.
 * @param cuisineTypes The cuisine types of the vendor list.
 * @param setCuisineTypeFilter The function to update the cuisine type filter value.
 * @returns An array of filter options.
 */
export function generateFilterOptions(
  setPriceRangeFilter: React.Dispatch<React.SetStateAction<string[]>>,
  cuisineTypes: string[],
  setCuisineTypeFilter: React.Dispatch<React.SetStateAction<string>>
): JSX.Element[] {
  return [
    // Price range filter.
    <CustomSlider
      label="Price range"
      defaultValue={[1, 3]}
      step={1}
      min={1}
      max={3}
      marks={[
        { value: 1, label: "$" },
        { value: 2, label: "$$" },
        { value: 3, label: "$$$" },
      ]}
      onChange={(values) => {
        // Convert the slider values to a string array.
        const sliderValues: string[] = values.map((value: number) => {
          switch (value) {
            case 1:
              return "$";
            case 2:
              return "$$";
            case 3:
              return "$$$";
            default:
              return "";
          }
        });
        setPriceRangeFilter(sliderValues);
      }}
    />,
    // Category filter.
    <CustomAutoComplete
      label="Cuisine Type"
      options={cuisineTypes}
      placeholder="Enter a cuisine type"
      defaultValue={""}
      isOptionEqual={(option, value) => value === "" || option === value}
      onChange={(input) => {
        setCuisineTypeFilter(input);
      }}
    />,
  ];
}

///////////////////////////////////////////// SORTING //////////////////////////////////////////////
/**
 * Helper function to generate an array of functions for sorting.
 * @param activeVendorList The active vendor list.
 * @param setActiveVendorList The function to update the active vendor list.
 * @returns An array of functions to execute for each sort option when clicked.
 * */
export function generateSortFunctions(
  activeVendorList: Vendor[],
  setActiveVendorList: React.Dispatch<React.SetStateAction<Vendor[]>>
): (() => void)[] {
  return VendorListManipulation.sortFunctions.map(
    (sortFn: (listToSort: Vendor[]) => Vendor[]) => () =>
      setActiveVendorList(sortFn(activeVendorList))
  );
}
