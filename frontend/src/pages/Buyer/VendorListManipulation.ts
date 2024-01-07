/**************************************************************************************************                                                                      *
 * This file contains the manipulation options for all vendors.                                   *
 * These manipulation options including searching, filtering, and sorting.                        *
 **************************************************************************************************/

import { Vendor } from "../../models/users/vendor";

/////////////////////////////////////////////// GENERAL ////////////////////////////////////////////
/**
 * Function to prepare and return the cart, saved, and unsaved lists depending on the active list.
 * @param activeList The active list to prepare the cart, saved, and unsaved lists from.
 * @param cartList The existing cart list.
 * @param savedList The existing saved list.
 * @returns The cart, saved, and unsaved lists. [cart, saved, unsaved]
 */
export function prepareLists(
  activeList: Vendor[],
  cartList: Vendor[],
  savedList: Vendor[]
): [Vendor[], Vendor[], Vendor[]] {
  // Initialize the lists to return
  const cartVendorList: Vendor[] = [];
  const savedVendorList: Vendor[] = [];
  const unsavedVendorList: Vendor[] = [];

  // Get the vendor ids from the cart and saved list
  const cartListIds: string[] = cartList.map((vendor) => vendor._id);
  const savedListIds: string[] = savedList.map((vendor) => vendor._id);

  // Iterate through the active list
  activeList.forEach((vendor: Vendor) => {
    // If vendor is in both the active list & cart list, then keep it in the cart list
    if (cartListIds.includes(vendor._id)) cartVendorList.push(vendor);
    // If vendor is in both the active list & saved list, then keep it in the saved list
    else if (savedListIds.includes(vendor._id)) savedVendorList.push(vendor);
    // If vendor neither in the cart or saved list, add it to the unsaved list
    else unsavedVendorList.push(vendor);
  });

  return [cartVendorList, savedVendorList, unsavedVendorList];
}

//////////////////////////////////////////// SEARCHING /////////////////////////////////////////////
/**
 * Function to search the vendor list by its name, categories, or price range.
 * @param completeList The complete vendor list to search.
 * @param searchValue The value to search for.
 * @returns The filtered vendor list.
 */
export const handleSearch = (completeList: Vendor[], searchValue: string): Vendor[] => {
  const refinedSearchValue = searchValue.toLowerCase().trim();
  return completeList.filter((vendor: Vendor) => {
    const name: string = vendor.vendorName.toLowerCase();
    const includesName: boolean = name.includes(refinedSearchValue);
    const categories: string = vendor.cuisineTypes.join(" ").toLowerCase();
    const includesCategory: boolean = categories.includes(refinedSearchValue);
    const priceRange: string = vendor.priceRange;
    const includesPriceRange: boolean = priceRange === refinedSearchValue;
    return includesName || includesCategory || includesPriceRange;
  });
};

//////////////////////////////////////////// FILTERING /////////////////////////////////////////////
/**
 * Function to retrieve all the unique cuisine types within a vendor in a sorted order.
 * @param vendorList The vendor list to retrieve the cuisine types from.
 * @returns The array of sorted unique cuisine types.
 */
export function getCuisineTypes(vendorList: Vendor[]): string[] {
  const cuisineTypeSet = new Set<string>();
  vendorList.forEach((vendor: Vendor) => {
    vendor.cuisineTypes.forEach((category: string) => {
      cuisineTypeSet.add(category);
    });
  });
  return Array.from(cuisineTypeSet).sort();
}

/**
 * Function to filter a vendor list by its price range and cuisine types.
 * @param vendorList The vendor list to filter.
 * @param priceRange The price range to filter by. [min, max]
 * @param cuisineType The cuisine type to filter by.
 * @returns The filtered vendor list.
 */
export function filterByPriceRangeAndCuisineType(
  vendorList: Vendor[],
  priceRange: string[],
  cuisineType: string
): Vendor[] {
  const isCuisineFilter: boolean = cuisineType !== "";
  const isPriceRangeFilter: boolean = priceRange[0] !== "$" || priceRange[1] !== "$$$";
  // Filtering by both price range and cuisine type
  if (isCuisineFilter && isPriceRangeFilter)
    return vendorList.filter(
      (vendor: Vendor) =>
        vendor.cuisineTypes.includes(cuisineType) &&
        vendor.priceRange.length >= priceRange[0].length &&
        vendor.priceRange.length <= priceRange[1].length
    );
  // Filtering by cuisine type only
  else if (isCuisineFilter)
    return vendorList.filter((vendor: Vendor) => vendor.cuisineTypes.includes(cuisineType));
  // Filtering by price range only
  else if (isPriceRangeFilter)
    return vendorList.filter(
      (vendor: Vendor) =>
        vendor.priceRange.length >= priceRange[0].length &&
        vendor.priceRange.length <= priceRange[1].length
    );
  else return vendorList;
}

///////////////////////////////////////////// SORTING //////////////////////////////////////////////
/** Array of sort options. */
export const sortOptions = [
  "Price Range (Asc.)",
  "Price Range (Des.)",
  "Name (Asc.)",
  "Name (Des.)",
];

/** Array of functions to execute for each sort option when clicked. */
export const sortFunctions: ((vendorsList: Vendor[]) => Vendor[])[] = [
  (menu) => sortByPriceRange(menu, true),
  (menu) => sortByPriceRange(menu, false),
  (menu) => sortByName(menu, true),
  (menu) => sortByName(menu, false),
];

/**
 * Function to sort the vendor list by price range, either in ascending or descending order.
 * @param vendorList The vendor list to sort.
 * @param isAscending Whether to sort in ascending order.
 * @returns The sorted vendor list.
 */
function sortByPriceRange(vendorList: Vendor[], isAscending: boolean): Vendor[] {
  const priceRanges = ["$", "$$", "$$$"];
  return [...vendorList].sort((a, b) =>
    isAscending
      ? priceRanges.indexOf(a.priceRange) - priceRanges.indexOf(b.priceRange)
      : priceRanges.indexOf(b.priceRange) - priceRanges.indexOf(a.priceRange)
  );
}

/**
 * Function to sort the vendor list by name, either in ascending or descending order.
 * @param vendorList The vendor list to sort.
 * @param isAscending Whether to sort in ascending order.
 * @returns The sorted vendor list.
 */
function sortByName(vendorList: Vendor[], isAscending: boolean): Vendor[] {
  return [...vendorList].sort((a, b) =>
    isAscending
      ? a.vendorName.localeCompare(b.vendorName)
      : b.vendorName.localeCompare(a.vendorName)
  );
}
