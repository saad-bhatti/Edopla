/***************************************************************************************************
 * This file contains the UI for the menu page.                                                    *
 * The menu page displays all the menu items of a vendor.                                          *
 * The menu items can be searched, filtered, and sorted.                                           *
 **************************************************************************************************/

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Container, LinearProgress, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuItemCard from "../../components/card/MenuItemCard";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomFilter from "../../components/custom/CustomFilter";
import CustomSearch from "../../components/custom/CustomSearch";
import { displayError } from "../../errors/displayError";
import { CartItem } from "../../models/items/cartItem";
import { MenuItem } from "../../models/items/menuItem";
import { createCart, emptyCart, updateItem } from "../../network/items/carts_api";
import { getMenu } from "../../network/items/menus_api";
import { SectionTitleText } from "../../styles/Text";
import { minPageHeight, minPageWidth } from "../../styles/constants";
import { CartsContext, SnackbarContext, snackBarColor } from "../../utils/contexts";
import * as MenuManipulation from "./MenuManipulation";
import * as MenuPageHelper from "./MenuPageHelper";

/** UI for the menu page. */
const MenuPage = () => {
  // Retrieve the vendor id from the URL path.
  const { vendorId } = useParams();
  // Retrieve the logged in user's cart.
  const { carts, setCarts } = useContext(CartsContext) || {};
  // Retrieve the snackbar from the context.
  const { setSnackbar } = useContext(SnackbarContext) || {};
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showLoadingError, setShowLoadingError] = useState(false);
  // State to track the entire menu.
  const [completeMenu, setCompleteMenu] = useState<MenuItem[]>([]);
  // State to track the active menu.
  const [activeMenu, setActiveMenu] = useState<MenuItem[]>([]);
  // State to track the user's cart for this vendor.
  const [cart, setCart] = useState<CartItem | null>(null);

  /** Retrieve the menu only once before rendering the page. */
  useEffect(() => {
    async function loadMenu() {
      try {
        if (!vendorId) throw new Error("No vendor id provided.");
        setShowLoadingError(false);
        setIsLoading(true); // Show the loading indicator

        // Retrieve the menu and set the respective states.
        const menu: MenuItem[] = await getMenu(vendorId);
        setCompleteMenu(menu);
        setActiveMenu(menu);

        // Initialzie the user's cart for this vendor, if it exists.
        const existingCart = carts!.find((cartItem) => cartItem.vendorId._id === vendorId);
        if (existingCart) setCart(existingCart);
        else setCart(null);
      } catch (error) {
        displayError(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadMenu();
  }, [carts, vendorId]);

  /**
   * Function to set the snackbar format and its visibility.
   * @param text The text to display in the snackbar.
   * @param color The color of the snackbar.
   * @param visible Whether the snackbar is visible or not.
   */
  function updateSnackbar(text: string, color: snackBarColor, visible: boolean): void {
    setSnackbar!({ text, color, visible });
  }

  /** Function to search the menu by its name or category. */
  const handleMenuSearch = (searchValue: string): void => {
    MenuPageHelper.handleSearch(completeMenu, searchValue, setActiveMenu);
  };
  /** Array containing the price range of the menu. */
  const priceRange: number[] = MenuManipulation.getPriceRange(completeMenu);
  /** Array containing the categories of the menu. */
  const categories: string[] = MenuManipulation.getCategories(completeMenu);
  /** State to track the slider values. */
  const [priceFilter, setPriceFilter] = useState<number[]>([priceRange[0], priceRange[1]]);
  /** State to track the category filter. */
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  // Callback function to be invoked when the "Apply" button is clicked in the filter
  const handleFilterApply = () => {
    MenuPageHelper.applyFilter(completeMenu, priceFilter, categoryFilter, setActiveMenu);
  };
  /** Array of filter options. */
  const filterOptions = MenuPageHelper.generateFilterOptions(
    priceRange,
    setPriceFilter,
    categories,
    setCategoryFilter
  );
  /** Array of functions to execute for each sort option when clicked. */
  const sortFunctions: (() => void)[] = MenuPageHelper.generateSortFunctions(
    activeMenu,
    setActiveMenu
  );

  async function onItemUpdate(menuItem: MenuItem, quantity: number): Promise<void> {
    // If the user's cart for this vendor already exists
    try {
      if (cart) {
        // Send request to update the cart
        const requestDetails = { item: { item: menuItem._id, quantity: quantity } };
        const updatedCart = await updateItem(cart._id, requestDetails);

        // If the resulting cart is empty, remove it from the context
        if (updatedCart.items.length === 0) {
          emptyCart(updatedCart._id);
          setCarts!(carts!.filter((cartItem) => cartItem._id !== updatedCart._id));
        }

        // Otherwise, update the cart in the context
        else
          setCarts!(
            carts!.map((cartItem) => (cartItem._id === updatedCart._id ? updatedCart : cartItem))
          );

        // Show snackbar to indicate success.
        updateSnackbar(
          quantity
            ? "Item successfully modified in the cart!"
            : "Item successfully removed from the cart!",
          "success",
          true
        );
      }
      // If the user's cart for this vendor does not exist
      else {
        // Send request to create the cart
        const requestDetails = {
          vendorId: vendorId!,
          items: [{ item: menuItem._id, quantity: quantity }],
        };
        const newCart = await createCart(requestDetails);
        // Update the cart in the context
        setCarts!([...carts!, newCart]);

        // Show snackbar to indicate success.
        updateSnackbar("Item successfully added to the cart!", "success", true);
      }
    } catch (error) {
      // Show snackbar to indicate failure.
      updateSnackbar("Failed to add or update the item to the cart.", "danger", true);
    }
  }

  /** Variable containing the display for all menu items. */
  const MenuItemsStack = (
    <Stack spacing={2} sx={{ overflow: "auto" }}>
      {activeMenu.map((menuItem: MenuItem) =>
        cart && cart.items.find((itemInCart) => itemInCart.item._id === menuItem._id) ? (
          // If the menu item is in the user's cart, set the quantity to the cart's quantity.
          <MenuItemCard
            key={menuItem._id}
            menuItem={menuItem}
            quantity={
              cart.items.find((itemInCart) => itemInCart.item._id === menuItem._id)?.quantity
            }
            onItemUpdate={onItemUpdate}
          />
        ) : (
          // Otherwise, don't set the quantity.
          <MenuItemCard key={menuItem._id} menuItem={menuItem} onItemUpdate={onItemUpdate} />
        )
      )}
    </Stack>
  );

  /** Sx for when a loading error occurs. */
  const errorSx: SxProps = {
    margin: 0,
    minHeight: minPageHeight,
  };

  /** Sx for the menu page. */
  const customSx: SxProps = {
    py: 5,
    minWidth: minPageWidth,
    minHeight: minPageHeight,
  };

  /** UI layout for the profiles page. */
  return (
    <>
      {/* Display for the indicator while menu is loading. */}
      {isLoading && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for when the menu fails to load. */}
      {showLoadingError && (
        <Stack id="MenuPage" direction="row" justifyContent="center" gap={5} py={10} sx={errorSx}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20vh" }} />
          <SectionTitleText>Something went wrong. Please try again.</SectionTitleText>
        </Stack>
      )}

      {/* Display if no vendor id is provided. */}
      {!isLoading && !showLoadingError && !vendorId && (
        <Stack id="MenuPage" direction="row" justifyContent="center" gap={5} py={10} sx={errorSx}>
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20vh" }} />
          <SectionTitleText>No vendor id provided.</SectionTitleText>
        </Stack>
      )}

      {/* Display each menu item. */}
      {!isLoading && !showLoadingError && vendorId && (
        <Container id="MenuPage" sx={customSx}>
          {/* Search bar. */}
          <CustomSearch
            placeholder="Search by name or category"
            initialValue=""
            activeSearch={true}
            onSearch={handleMenuSearch}
            sx={{ width: "50%", mx: "auto" }}
          />

          <Stack
            useFlexGap
            direction="row"
            spacing={{ xs: 0, sm: 2 }}
            justifyContent={{ xs: "space-between" }}
            flexWrap="wrap"
            sx={{ minWidth: 0 }}
            margin={{ xs: "0 0 5px 0" }}
          >
            {/* Drawer for the filter options. */}
            <CustomFilter
              filterOptions={filterOptions}
              onApply={handleFilterApply}
              onRemove={() => {
                setActiveMenu(completeMenu);
              }}
              variant="outlined"
              color="neutral"
            />

            {/* Dropdown for the sort options. */}
            <CustomDropdown
              label="Sort by"
              options={MenuManipulation.sortOptions}
              onOptionClick={sortFunctions}
              variant="plain"
              color="primary"
            />
          </Stack>

          {/* Display for the menu items. */}
          {MenuItemsStack}
        </Container>
      )}
    </>
  );
};

export default MenuPage;
