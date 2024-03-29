/***************************************************************************************************
 * This file contains the UI for the buy page.                                                     *
 * The buy page displays the cards of all the vendors.                                             *
 * The vendors can be searched, filtered, and sorted.                                              *
 **************************************************************************************************/

import { Container, LinearProgress, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useEffect, useState } from "react";
import VendorInformationCard from "../components/card/VendorInformationCard";
import CustomDropdown from "../components/custom/CustomDropdown";
import CustomFilter from "../components/custom/CustomFilter";
import CustomSearch from "../components/custom/CustomSearch";
import { displayError } from "../errors/displayError";
import { Vendor } from "../models/users/vendor";
import { getSavedVendors, toggleSavedVendor } from "../network/users/buyers_api";
import { getAllVendors } from "../network/users/vendors_api";
import { ErrorPageText, mobileScreenInnerWidth } from "../styles/TextSX";
import * as Contexts from "../utils/contexts";
import * as BuyerPageHelper from "./helpers/BuyerPageHelper";
import * as VendorListManipulation from "./manipulation/VendorListManipulation";

/** UI for the buy page. */
const BuyPage = () => {
  // Retrieve the logged in user.
  const { user } = useContext(Contexts.UserContext) || {};
  // Retrieve the user's cart.
  const { carts } = useContext(Contexts.CartsContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Contexts.SnackbarContext) || {};
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showLoadingError, setShowLoadingError] = useState(false);

  // State to contain information of all vendors.
  const [completeVendorList, setCompleteVendorList] = useState<Vendor[]>([]);
  // State to contain information of all the active vendors.
  const [activeVendorList, setActiveVendorList] = useState<Vendor[]>([]);
  // State to contain information of the vendors in the cart.
  const [cartVendorList, setCartVendorList] = useState<Vendor[]>([]);
  // State to contain information of the saved vendors.
  const [savedVendorList, setSavedVendorList] = useState<Vendor[]>([]);
  // State to contain information of the unsaved vendors.
  const [unsavedVendorList, setUnsavedVendorList] = useState<Vendor[]>([]);
  // State to track the search value.
  const [searchValue, setSearchValue] = useState<string>("");

  /** Set the necessary states before rendering the page. */
  useEffect(() => {
    async function loadVendors() {
      try {
        setShowLoadingError(false);
        setIsLoading(true);

        let allVendors: Vendor[] = completeVendorList;
        let activeVendors: Vendor[] = activeVendorList;
        let savedVendors: Vendor[] = savedVendorList;
        let cartVendors: Vendor[] = cartVendorList;
        if (!activeVendors.length && !searchValue) {
          allVendors = await getAllVendors();
          savedVendors = await getSavedVendors();
          cartVendors = carts!.map((cart) => cart.vendorId);
          activeVendors = allVendors;
        }

        // Prepare the vendor lists
        const preparedLists: [Vendor[], Vendor[], Vendor[]] = VendorListManipulation.prepareLists(
          activeVendors,
          cartVendors,
          savedVendors
        );

        // Update the states
        setCompleteVendorList(allVendors);
        setCartVendorList(preparedLists[0]);
        setSavedVendorList(preparedLists[1]);
        setUnsavedVendorList(preparedLists[2]);
      } catch (error) {
        displayError(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, carts, activeVendorList]);

  /** Function to search the complete vendor list by its name, categories, or price range. */
  function handleVendorSearch(searchValue: string): void {
    setSearchValue(searchValue);
    const filteredList: Vendor[] = VendorListManipulation.handleSearch(
      completeVendorList,
      searchValue
    );
    if (filteredList.length) setActiveVendorList(filteredList);
    else {
      setSnackbar!({
        text: "No vendor matching the search was found.",
        color: "danger",
        visible: true,
      });
      setActiveVendorList(completeVendorList);
    }
  }

  /** Array containing the categories of the menu. */
  const cuisineTypes: string[] = VendorListManipulation.getCuisineTypes(completeVendorList);
  /** State to track the slider values. */
  const [priceRangeFilter, setPriceRangeFilter] = useState<string[]>(["$", "$$$"]);
  /** State to track the cuisine type filter. */
  const [cuisineFilter, setCuisineFilter] = useState<string>("");
  /** Array of filter options. */
  const filterOptions = BuyerPageHelper.generateFilterOptions(
    setPriceRangeFilter,
    cuisineTypes,
    setCuisineFilter
  );
  function handleApplyFilter() {
    const filteredList = VendorListManipulation.filterByPriceRangeAndCuisineType(
      completeVendorList,
      priceRangeFilter,
      cuisineFilter
    );

    // Update the activeVendorList state with the filtered vendor list
    if (filteredList.length) setActiveVendorList(filteredList);
    else {
      setSnackbar!({
        text: "No vendor matching the filter was found.",
        color: "danger",
        visible: true,
      });
      setActiveVendorList(completeVendorList);
    }
  }

  /** Array of functions to execute for each sort option when clicked. */
  const sortFunctions: (() => void)[] = BuyerPageHelper.generateSortFunctions(
    activeVendorList,
    setActiveVendorList
  );

  /** UI layout for the vendor view options. */
  const VendorListViewOptions = (
    <>
      {/* Search bar. */}
      <CustomSearch
        placeholder="Search"
        initialValue={searchValue}
        activeSearch={true}
        onSearch={handleVendorSearch}
        sx={{
          maxWidth: window.innerWidth <= mobileScreenInnerWidth ? "100%" : "50%",
          mx: "auto",
          mb: window.innerWidth <= mobileScreenInnerWidth ? "3%" : "0%",
        }}
      />

      {/* Filter and sort options. */}
      <Stack
        useFlexGap
        direction="row"
        spacing={2}
        justifyContent="space-between"
        flexWrap="wrap"
        mb="1%"
      >
        {/* Drawer for the filter options. */}
        <CustomFilter
          filterOptions={filterOptions}
          onApply={handleApplyFilter}
          onRemove={() => {
            setActiveVendorList(completeVendorList);
          }}
          variant="outlined"
          color="neutral"
        />

        {/* Dropdown for the sort options. */}
        <CustomDropdown
          label="Sort by"
          options={VendorListManipulation.sortOptions}
          onOptionClick={sortFunctions}
          variant="plain"
          color="primary"
        />
      </Stack>
    </>
  );

  /**
   * Function to handle toggling a vendor's saved status.
   * @param vendorToToggle The vendor to save or unsave.
   * @returns Nothing.
   */
  async function toggleVendor(vendorToToggle: Vendor) {
    try {
      const updatedSavedVendors = await toggleSavedVendor({ vendorId: vendorToToggle._id });
      const initialLength = savedVendorList.length;
      const updatedLength = updatedSavedVendors.length;

      setSavedVendorList(updatedSavedVendors);
      if (updatedLength > initialLength)
        setUnsavedVendorList(
          unsavedVendorList.filter((vendor) => vendor._id !== vendorToToggle._id)
        );
      else setUnsavedVendorList([...unsavedVendorList, vendorToToggle]);

      // Show snackbar to indicate success.
      setSnackbar!({
        text:
          updatedLength > initialLength
            ? "Vendor successfully saved!"
            : "Vendor successfully unsaved!",
        color: "success",
        visible: true,
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbar!({
        text: "Failed to save or unsave the vendor.",
        color: "danger",
        visible: true,
      });
    }
  }

  /** UI layout for the vendor cards in the cart. */
  const CartCards = carts!.length ? (
    <Stack id="cardVendorsSection" direction="column" gap={2}>
      <Typography level="h3">Continue Shopping</Typography>
      {cartVendorList.map((vendor) => (
        <VendorInformationCard
          key={`cart-${vendor._id}`}
          vendor={vendor}
          isSaved={savedVendorList.includes(vendor)}
          onSaveToggled={() => toggleVendor(vendor)}
          isCart={true}
        />
      ))}
    </Stack>
  ) : null;

  /** UI layout for the saved vendor cards. */
  const SavedCards = savedVendorList.length ? (
    <Stack id="savedVendorsSection" direction="column" gap={2}>
      <Typography level="h3">Saved Vendors</Typography>
      {savedVendorList.map((vendor) => (
        <VendorInformationCard
          key={`saved-${vendor._id}`}
          vendor={vendor}
          isSaved={true}
          onSaveToggled={() => toggleVendor(vendor)}
        />
      ))}
    </Stack>
  ) : null;

  /** UI layout for the unsaved vendor cards. */
  const UnsavedCards = unsavedVendorList.length ? (
    <Stack id="unsavedVendorsSection" direction="column" gap={2}>
      <Typography level="h3">Other Vendors</Typography>
      {unsavedVendorList.map((vendor) => (
        <VendorInformationCard
          key={`unsaved-${vendor._id}`}
          vendor={vendor}
          isSaved={false}
          onSaveToggled={() => toggleVendor(vendor)}
        />
      ))}
    </Stack>
  ) : null;

  /** Sx for the buyer page. */
  const customSx: SxProps = {
    py: 5,
  };

  /** UI layout for the profiles page. */
  return (
    <>
      {/* Display for the indicator while menu is loading. */}
      {isLoading && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for when the menu fails to load. */}
      {showLoadingError && (
        <ErrorPageText id="BuyPage">Something went wrong. Please try again.</ErrorPageText>
      )}

      {/* Display each menu item. */}
      {!isLoading && !showLoadingError && (
        <Container id="BuyPage" sx={customSx}>
          {/* Display for the vendor view options. */}
          {VendorListViewOptions}

          {/* Display for the vendor cards. */}
          <Stack direction="column" gap={4}>
            {/** Vendors in cart section. */}
            {CartCards}

            {/** Saved vendors section. */}
            {SavedCards}

            {/** Unsaved vendors section. */}
            {UnsavedCards}
          </Stack>
        </Container>
      )}
    </>
  );
};

export default BuyPage;
