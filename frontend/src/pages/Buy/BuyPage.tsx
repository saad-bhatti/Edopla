import CloseIcon from "@mui/icons-material/Close";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Button, Container, LinearProgress, Stack, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import VendorInformationCard from "../../components/card/VendorInformationCard";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomFilter from "../../components/custom/CustomFilter";
import CustomSearch from "../../components/custom/CustomSearch";
import CustomSnackbar from "../../components/custom/CustomSnackbar";
import { displayError } from "../../errors/displayError";
import { Vendor } from "../../models/users/vendor";
import { getSavedVendors, toggleSavedVendor } from "../../network/users/buyers_api";
import { getAllVendors } from "../../network/users/vendors_api";
import * as Contexts from "../../utils/contexts";
import * as BuyManipulation from "./BuyManipulation";
import * as BuyPageHelper from "./BuyPageHelper";

/***************************************************************************************************
 * This file contains the UI for the buy page.                                                     *
 * The buy page displays the cards of all the vendors.                                             *
 * The vendors can be searched, filtered, and sorted.                                              *
 **************************************************************************************************/

/** UI for the buy page. */
const BuyPage = () => {
  // Retrieve the logged in user.
  const { loggedInUser } =
    useContext<Contexts.LoggedInUserContextProps | null>(Contexts.LoggedInUserContext) || {};
  // Retrieve the user's cart.
  const { carts } = useContext<Contexts.CartsContextProps | null>(Contexts.CartsContext) || {};
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
  // State to control the display of the snackbar.
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // State to track the text and color of the snackbar.
  type possibleColors = "primary" | "neutral" | "danger" | "success" | "warning";
  const [snackbarFormat, setSnackbarFormat] = useState<{
    text: string;
    color: possibleColors;
  }>({
    text: "",
    color: "primary",
  });

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
        const preparedLists: [Vendor[], Vendor[], Vendor[]] = BuyManipulation.prepareLists(
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
  }, [loggedInUser, carts, activeVendorList]);

  /** Function to search the complete vendor list by its name, categories, or price range. */
  function handleVendorSearch(searchValue: string): void {
    setSearchValue(searchValue);
    const filteredList: Vendor[] = BuyManipulation.handleSearch(completeVendorList, searchValue);
    if (filteredList.length) setActiveVendorList(filteredList);
    else {
      setSnackbarFormat({
        text: "No vendor matching the search was found.",
        color: "warning",
      });
      setSnackbarVisible(true);
      setActiveVendorList(completeVendorList);
    }
  }

  /** Array containing the categories of the menu. */
  const cuisineTypes: string[] = BuyManipulation.getCuisineTypes(completeVendorList);
  /** State to track the slider values. */
  const [priceRangeFilter, setPriceRangeFilter] = useState<string[]>(["$", "$$$"]);
  /** State to track the cuisine type filter. */
  const [cuisineFilter, setCuisineFilter] = useState<string>("");
  /** Array of filter options. */
  const filterOptions = BuyPageHelper.generateFilterOptions(
    setPriceRangeFilter,
    cuisineTypes,
    setCuisineFilter
  );
  function handleApplyFilter() {
    const filteredList = BuyManipulation.filterByPriceRangeAndCuisineType(
      completeVendorList,
      priceRangeFilter,
      cuisineFilter
    );

    // Update the activeVendorList state with the filtered vendor list
    if (filteredList.length) setActiveVendorList(filteredList);
    else {
      setSnackbarFormat({
        text: "No vendor matching the filter was found.",
        color: "warning",
      });
      setSnackbarVisible(true);
      setActiveVendorList(completeVendorList);
    }
  }

  /** Array of functions to execute for each sort option when clicked. */
  const sortFunctions: (() => void)[] = BuyPageHelper.generateSortFunctions(
    activeVendorList,
    setActiveVendorList
  );

  /** UI layout for the vendor view options. */
  const VendorListViewOptions = (
    <>
      {/* Search bar. */}
      <Stack direction="row" gap={0.5} justifyContent="center">
        <CustomSearch
          placeholder="Search"
          initialValue={searchValue}
          activeSearch={true}
          onSearch={handleVendorSearch}
          sx={{ width: "50%" }}
        />
        {searchValue && (
          <Button
            variant="solid"
            color="warning"
            onClick={() => handleVendorSearch("")}
            endDecorator={<CloseIcon />}
          >
            Clear Search
          </Button>
        )}
      </Stack>

      {/* Filter and sort options. */}
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
          options={BuyManipulation.sortOptions}
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
      setSnackbarFormat({
        text:
          updatedLength > initialLength
            ? "Vendor successfully saved!"
            : "Vendor successfully unsaved!",
        color: "success",
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to add or update the item to the cart.",
        color: "danger",
      });
    } finally {
      setSnackbarVisible(true);
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

  /** UI layout for the snackbar. */
  const Snackbar = (
    <CustomSnackbar
      content={snackbarFormat.text}
      color={snackbarFormat.color}
      open={snackbarVisible}
      onClose={() => {
        setSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** UI layout for the profiles page. */
  return (
    <Container id="BuyPage">
      {/* Display for the indicator while menu is loading. */}
      {isLoading && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for when the menu fails to load. */}
      {showLoadingError && <p>Something went wrong. Please try again.</p>}

      {/* Display each menu item. */}
      {!isLoading && !showLoadingError && (
        <>
          {/* Display for the snackbar. */}
          {Snackbar}

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
        </>
      )}
    </Container>
  );
};

export default BuyPage;
