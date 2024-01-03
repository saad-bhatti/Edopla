import { Vendor } from "../../models/users/vendor";

/**************************************************************************************************                                                                      *
 * This file contains the manipulation options for all vendors.                                   *
 * These manipulation options including searching, filtering, and sorting.                        *
 **************************************************************************************************/

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

// //////////////////////////////////////////// FILTERING /////////////////////////////////////////////
// /**
//  * Function to retrieve the range of prices within a menu.
//  * @param menu The menu to retrieve the price range from.
//  * @returns The array of price range [min, max].
//  */
// export function getPriceRange(menu: MenuItem[]): number[] {
//   const prices = menu.map((menuItem) => menuItem.price);
//   return [Math.min(...prices), Math.max(...prices)];
// }

// /**
//  * Function to retrieve all the unique categories within a menu in a sorted order.
//  * @param menu The menu to retrieve the categories from.
//  * @returns The array of sorted unique categories.
//  */
// export function getCategories(menu: MenuItem[]): string[] {
//   const categorySet = new Set<string>();
//   menu.forEach((menuItem) => categorySet.add(menuItem.category));
//   return Array.from(categorySet).sort();
// }

// /**
//  * Function to filter the menu by price and category.
//  * @param menu The menu to filter.
//  * @param priceRange The price range to filter by. [min, max]
//  * @param category The category to filter by.
//  * @returns The filtered menu.
//  */
// export function filterByPriceAndCategory(
//   menu: MenuItem[],
//   priceRange: number[],
//   category: string
// ): MenuItem[] {
//   const isCategoryFilter: boolean = category !== "";
//   const isPriceFilter: boolean = priceRange !== getPriceRange(menu);
//   // Filtering by both price and category
//   if (isCategoryFilter && isPriceFilter)
//     return menu.filter(
//       (menuItem) =>
//         menuItem.price >= priceRange[0] &&
//         menuItem.price <= priceRange[1] &&
//         menuItem.category === category
//     );
//   // Filtering by category only
//   else if (isCategoryFilter) return menu.filter((menuItem) => menuItem.category === category);
//   // Filtering by price only
//   else if (isPriceFilter)
//     return menu.filter(
//       (menuItem) => menuItem.price >= priceRange[0] && menuItem.price <= priceRange[1]
//     );
//   else return menu;
// }

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
