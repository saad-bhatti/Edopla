import { MenuItem } from "../../models/items/menuItem";

/**************************************************************************************************                                                                      *
 * This file contains the manipulation options for the menu.                                      *
 * These manipulation options including searching, filtering, and sorting.                        *
 **************************************************************************************************/

//////////////////////////////////////////// SEARCHING /////////////////////////////////////////////
/**
 * Function to search the menu by its name or category.
 * @param completeMenu The complete menu to search.
 * @param searchValue The value to search for.
 * @returns The filtered menu.
 */
export const handleSearch = (completeMenu: MenuItem[], searchValue: string): MenuItem[] => {
  const refinedSearchValue = searchValue.toLowerCase().trim();
  return completeMenu.filter((menuItem: MenuItem) => {
    const name = menuItem.name.toLowerCase();
    const category = menuItem.category.toLowerCase();
    return name.includes(refinedSearchValue) || category.includes(refinedSearchValue);
  });
};

//////////////////////////////////////////// FILTERING /////////////////////////////////////////////
/**
 * Function to retrieve the range of prices within a menu.
 * @param menu The menu to retrieve the price range from.
 * @returns The array of price range [min, max].
 */
export function getPriceRange(menu: MenuItem[]): number[] {
  const prices = menu.map((menuItem) => menuItem.price);
  return [Math.min(...prices), Math.max(...prices)];
}

/**
 * Function to retrieve all the unique categories within a menu in a sorted order.
 * @param menu The menu to retrieve the categories from.
 * @returns The array of sorted unique categories.
 */
export function getCategories(menu: MenuItem[]): string[] {
  const categorySet = new Set<string>();
  menu.forEach((menuItem) => categorySet.add(menuItem.category));
  return Array.from(categorySet).sort();
}

/**
 * Function to filter the menu by price and category.
 * @param menu The menu to filter.
 * @param priceRange The price range to filter by. [min, max]
 * @param category The category to filter by.
 * @returns The filtered menu.
 */
export function filterByPriceAndCategory(
  menu: MenuItem[],
  priceRange: number[],
  category: string
): MenuItem[] {
  const isCategoryFilter: boolean = category !== "";
  const isPriceFilter: boolean = priceRange !== getPriceRange(menu);
  // Filtering by both price and category
  if (isCategoryFilter && isPriceFilter)
    return menu.filter(
      (menuItem) =>
        menuItem.price >= priceRange[0] &&
        menuItem.price <= priceRange[1] &&
        menuItem.category === category
    );
  // Filtering by category only
  else if (isCategoryFilter) return menu.filter((menuItem) => menuItem.category === category);
  // Filtering by price only
  else if (isPriceFilter)
    return menu.filter(
      (menuItem) => menuItem.price >= priceRange[0] && menuItem.price <= priceRange[1]
    );
  else return menu;
}

///////////////////////////////////////////// SORTING //////////////////////////////////////////////
/** Array of sort options. */
export const sortOptions = [
  "Category",
  "Price (Asc.)",
  "Price (Des.)",
  "Name (Asc.)",
  "Name (Des.)",
];

/** Array of functions to execute for each sort option when clicked. */
export const sortFunctions: ((menu: MenuItem[]) => MenuItem[])[] = [
  sortByCategory,
  (menu) => sortByPrice(menu, true),
  (menu) => sortByPrice(menu, false),
  (menu) => sortByName(menu, true),
  (menu) => sortByName(menu, false),
];

/**
 * Function to sort the menu by category.
 * @param menu The menu to sort.
 * @returns The sorted menu.
 */
function sortByCategory(menu: MenuItem[]): MenuItem[] {
  return [...menu].sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Function to sort the menu by price, either in ascending or descending order.
 * @param menu The menu to sort.
 * @param isAscending Whether to sort in ascending order.
 * @returns The sorted menu.
 */
function sortByPrice(menu: MenuItem[], isAscending: boolean): MenuItem[] {
  return [...menu].sort((a, b) => (isAscending ? a.price - b.price : b.price - a.price));
}

/**
 * Function to sort the menu by name, either in ascending or descending order.
 * @param menu The menu to sort.
 * @param isAscending Whether to sort in ascending order.
 * @returns The sorted menu.
 */
function sortByName(menu: MenuItem[], isAscending: boolean): MenuItem[] {
  return [...menu].sort((a, b) =>
    isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
}
