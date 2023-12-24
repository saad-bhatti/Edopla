import { Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import MenuItemCard from "../../components/card/MenuItemCard";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomFilter from "../../components/custom/CustomFilter";
import CustomSearch from "../../components/custom/CustomSearch";
import { displayError } from "../../errors/displayError";
import { MenuItem } from "../../models/items/menuItem";
import { getMenu } from "../../network/items/menus_api";
import styleUtils from "../../styles/utils.module.css";
import * as MenuManipulation from "./MenuManipulation";
import * as MenuPageHelper from "./MenuPageHelper";

/**************************************************************************************************                                                                      *
 * This file contains the UI for the menu page.                                                    *
 * The menu page displays all the menu items of a vendor.                                          *
 * The menu items can be searched, filtered, and sorted.                                           *
 **************************************************************************************************/

/** UI for the menu page. */
const MenuPage = () => {
  // Retrieve the vendor id from the URL path.
  const { vendorId } = useParams();
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showLoadingError, setShowLoadingError] = useState(false);
  // State to track the entire menu.
  const [completeMenu, setCompleteMenu] = useState<MenuItem[]>([]);
  // State to track the active menu.
  const [activeMenu, setActiveMenu] = useState<MenuItem[]>([]);

  /** Retrieve the menu only once before rendering the page. */
  useEffect(() => {
    async function loadMenu() {
      try {
        if (!vendorId) throw new Error("No vendor id provided.");
        setShowLoadingError(false);
        setIsLoading(true); // Show the loading indicator
        const menu = await getMenu(vendorId);
        setCompleteMenu(menu);
        setActiveMenu(menu);
      } catch (error) {
        displayError(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadMenu();
  }, [vendorId]);

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

  /** Variable containing the display for all menu items. */
  const menuItemsStack = (
    <Stack spacing={2} sx={{ overflow: "auto" }}>
      {activeMenu.map((menuItem: MenuItem, index: number) => (
        <MenuItemCard key={index} menuItem={menuItem} />
      ))}
    </Stack>
  );

  /** UI layout for the profiles page. */
  return (
    <>
      {/* Display for the indicator while vendors are loading. */}
      {isLoading && <Spinner animation="border" variant="primary" />}

      {/* Display for when the menu fails to load. */}
      {showLoadingError && <p>Something went wrong. Please try again.</p>}

      {/* Display if no vendor id is provided. */}
      {!isLoading && !showLoadingError && !vendorId && (
        <h2 className={styleUtils.flexCenter}>No vendor id provided.</h2>
      )}

      {/* Display each menu item. */}
      {!isLoading && !showLoadingError && vendorId && (
        <>
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
          {menuItemsStack}
        </>
      )}
    </>
  );
};

export default MenuPage;
