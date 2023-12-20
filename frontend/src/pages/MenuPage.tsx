import { Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import MenuItemCard from "../components/card/MenuItemCard";
import CustomAutoComplete from "../components/custom/CustomAutoComplete";
import CustomDropdown from "../components/custom/CustomDropdown";
import CustomFilter from "../components/custom/CustomFilter";
import CustomSearch from "../components/custom/CustomSearch";
import CustomSlider from "../components/custom/CustomSlider";
import { MenuItem } from "../models/items/menuItem";
import { getMenu } from "../network/items/menus_api";
import styleUtils from "../styles/utils.module.css";
import * as MenuManipulation from "../utils/menuManipulation";

/* 
Remaining:
- Add node environment variables to the frontend.
- Filter functionality
*/

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
        console.error(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadMenu();
  }, [vendorId]);

  /** Variable containing the display for all menu items. */
  const menuItemsStack = (
    <Stack spacing={2} sx={{ overflow: "auto" }}>
      {activeMenu.map((menuItem: MenuItem, index: number) => (
        <MenuItemCard key={index} menuItem={menuItem} />
      ))}
    </Stack>
  );

  /** */
  const priceRange: number[] = MenuManipulation.getPriceRange(completeMenu);
  const categories: string[] = MenuManipulation.getCategories(completeMenu);

  /** Array of filter options. */
  const filterOptions = [
    // Price filter.
    <CustomSlider
      label="Price range"
      defaultValue={[priceRange[0], priceRange[2]]}
      step={1}
      min={priceRange[0]}
      max={priceRange[2]}
      marks={[
        { value: priceRange[0], label: `$${priceRange[0]}` },
        { value: priceRange[1], label: `$${priceRange[1]}` },
        { value: priceRange[2], label: `$${priceRange[2]}` },
      ]}
    />,
    // Category filter.
    <CustomAutoComplete
      label="Category"
      options={categories}
      placeholder="Choose a category"
      defaultValue={""}
      isOptionEqual={(option, value) => value === ""  || option === value}
    />,
  ];

  /** Function to search the menu by its name or category. */
  const handleSearch = (searchValue: string): void => {
    const filteredMenu = MenuManipulation.handleSearch(completeMenu, searchValue);
    setActiveMenu(filteredMenu);
  };

  /** Array of functions to execute for each sort option when clicked. */
  const sortFunctions: (() => void)[] = MenuManipulation.sortFunctions.map(
    (sortFn: (menuToSort: MenuItem[]) => MenuItem[]) => () => setActiveMenu(sortFn(activeMenu))
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
            placeholder="Search"
            initialValue=""
            activeSearch={true}
            onSearch={handleSearch}
          />

          {/* TODO for the filter options. */}
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
            <CustomFilter filterOptions={filterOptions} variant="outlined" color="neutral" />

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
