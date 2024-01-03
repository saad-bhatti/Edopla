import CustomAutoComplete from "../../components/custom/CustomAutoComplete";
import CustomSlider from "../../components/custom/CustomSlider";
import { Vendor } from "../../models/users/vendor";
import * as BuyManipulation from "./BuyManipulation";

/**************************************************************************************************                                                                      *
 * This file contains the helper functions for the buy page.                                      *
 * These helper functions are used to handle filter and sort.                                     *
 **************************************************************************************************/

// //////////////////////////////////////////// FILTERING /////////////////////////////////////////////
// /**
//  * Helper function to generate the filter options.
//  * @param priceRange The price range of the menu. [min, max]
//  * @param setPriceFilter The function to update the slider values.
//  * @param categories The categories of the menu.
//  * @returns An array of filter options.
//  */
// export function generateFilterOptions(
//   priceRange: number[],
//   setPriceFilter: React.Dispatch<React.SetStateAction<number[]>>,
//   categories: string[],
//   setCategoryFilter: React.Dispatch<React.SetStateAction<string>>
// ): JSX.Element[] {
//   return [
//     // Price filter.
//     <CustomSlider
//       label="Price range"
//       defaultValue={[priceRange[0], priceRange[1]]}
//       step={1}
//       min={priceRange[0]}
//       max={priceRange[1]}
//       marks={[
//         { value: priceRange[0], label: `$${priceRange[0]}` },
//         {
//           value: (priceRange[0] + priceRange[1]) / 2,
//           label: "$" + (priceRange[0] + priceRange[1]) / 2,
//         },
//         { value: priceRange[1], label: `$${priceRange[1]}` },
//       ]}
//       onChange={(values) => {
//         setPriceFilter(values);
//       }}
//     />,
//     // Category filter.
//     <CustomAutoComplete
//       label="Category"
//       options={categories}
//       placeholder="Choose a category"
//       defaultValue={""}
//       isOptionEqual={(option, value) => value === "" || option === value}
//       onChange={(input) => {
//         setCategoryFilter(input);
//       }}
//     />,
//   ];
// }

// /**
//  * Helper function to apply filters and update the active menu.
//  * @param completeMenu The complete menu.
//  * @param priceFilter The price filter values.
//  * @param categoryFilter The category filter value.
//  * @param setActiveMenu The function to update the active menu.
//  */
// export function applyFilter(
//   completeMenu: MenuItem[],
//   priceFilter: number[],
//   categoryFilter: string,
//   setActiveMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>
// ): void {
//   const filteredMenu = MenuManipulation.filterByPriceAndCategory(
//     completeMenu,
//     priceFilter,
//     categoryFilter
//   );

//   // Update the activeMenu state with the filtered menu
//   setActiveMenu(filteredMenu);
// }

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
  return BuyManipulation.sortFunctions.map(
    (sortFn: (listToSort: Vendor[]) => Vendor[]) => () =>
      setActiveVendorList(sortFn(activeVendorList))
  );
}
