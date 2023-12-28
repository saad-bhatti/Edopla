import { CartItem } from "../../models/items/cartItem";

/**************************************************************************************************                                                                      *
 * This file contains the manipulation options for the carts.                                     *
 * These manipulation options including general purpose, searching and sorting.                   *
 **************************************************************************************************/
///////////////////////////////////////////// GENERAL //////////////////////////////////////////////
/**
 * Function to seperate the provided carts based on whether they are saved for later or not.
 * @param carts The carts to seperate.
 * @returns The seperated carts. [carts not saved for later, carts saved for later].
 */
export function seperateCarts(carts: CartItem[]): [CartItem[], CartItem[]] {
  const nowCarts: CartItem[] = [];
  const laterCarts: CartItem[] = [];
  carts.forEach((cartItem: CartItem) => {
    cartItem.savedForLater ? laterCarts.push(cartItem) : nowCarts.push(cartItem);
  });
  return [nowCarts, laterCarts];
}

/**
 * Function to get the total quantity of each individual cart within the provided carts.
 * @param carts The carts to get the total quantity of.
 * @returns An array containing the total quantity of each individual cart.
 */
function getTotalQuantities(carts: CartItem[]): { cartItem: CartItem; itemQuantity: number }[] {
  // Traverse each cart item in the carts
  return carts.map((cartItem: CartItem) => {
    const itemQuantity: number = cartItem.items.length;
    return { cartItem: cartItem, itemQuantity: itemQuantity };
  });
}

/**
 * Function to get the total price of each individual cart within the provided carts.
 * @param carts The carts to get the total price of.
 * @returns An array containing the total price of each individual cart.
 */
function getTotalPrices(carts: CartItem[]): { cartItem: CartItem; cartTotal: number }[] {
  // Traverse each cart item in the carts
  return carts.map((cartItem: CartItem) => {
    let cartTotal: number = 0;
    // Traverse each item in the cart item
    cartItem.items.forEach((menuItem) => {
      const itemTotal: number = menuItem.item.price * menuItem.quantity;
      cartTotal += itemTotal;
    });
    return { cartItem: cartItem, cartTotal: cartTotal };
  });
}

//////////////////////////////////////////// SEARCHING /////////////////////////////////////////////
/**
 * Function to search the carts by vendor name or item names.
 * @param completeCarts The complete carts to search through.
 * @param searchValue The value to search for.
 * @returns The filtered carts.
 */
export function handleSearch(completeCarts: CartItem[], searchValue: string): CartItem[] {
  const refinedSearchValue = searchValue.toLowerCase().trim();
  return completeCarts.filter((cartItem: CartItem) => {
    // Search the vendor name to see if it contains the search value.
    const vendorName: string = cartItem.vendorId.vendorName.toLowerCase();
    const vendorNameContainsSearchValue: boolean = vendorName.includes(refinedSearchValue);

    // Search through item names to see if any of them contain the search value.
    const itemNamesContainSearchValue: boolean = cartItem.items.some((menuItem) => {
      const itemName: string = menuItem.item.name.toLowerCase();
      return itemName.includes(refinedSearchValue);
    });

    return vendorNameContainsSearchValue || itemNamesContainSearchValue;
  });
}

///////////////////////////////////////////// SORTING //////////////////////////////////////////////
/** Array of sort options. */
export const sortOptions = [
  "Item Quantity (Asc.)",
  "Item Quantity (Des.)",
  "Price (Asc.)",
  "Price (Des.)",
];

/** Array of functions to execute for each sort option when clicked. */
export const sortFunctions: ((carts: CartItem[]) => CartItem[])[] = [
  (carts) => sortByItemQuantity(carts, true),
  (carts) => sortByItemQuantity(carts, false),
  (carts) => sortByPrice(carts, true),
  (carts) => sortByPrice(carts, false),
];

/**
 * Function to sort the carts by item quantity, either in ascending or descending order.
 * @param carts The carts to sort.
 * @param isAscending Whether to sort in ascending order.
 * @returns The sorted carts.
 */
function sortByItemQuantity(carts: CartItem[], isAscending: boolean): CartItem[] {
  const cartQuantities: { cartItem: CartItem; itemQuantity: number }[] = getTotalQuantities(carts);
  cartQuantities.sort((a, b) => {
    if (a.itemQuantity < b.itemQuantity) return isAscending ? -1 : 1;
    if (a.itemQuantity > b.itemQuantity) return isAscending ? 1 : -1;
    return 0;
  });
  return cartQuantities.map((cartQuantity) => cartQuantity.cartItem);
}

/**
 * Function to sort the carts by price, either in ascending or descending order.
 * @param carts The carts to sort.
 * @param isAscending Whether to sort in ascending order.
 * @returns The sorted carts.
 */
function sortByPrice(carts: CartItem[], isAscending: boolean): CartItem[] {
  const cartTotals: { cartItem: CartItem; cartTotal: number }[] = getTotalPrices(carts);
  cartTotals.sort((a, b) => {
    if (a.cartTotal < b.cartTotal) return isAscending ? -1 : 1;
    if (a.cartTotal > b.cartTotal) return isAscending ? 1 : -1;
    return 0;
  });
  return cartTotals.map((cartTotal) => cartTotal.cartItem);
}
