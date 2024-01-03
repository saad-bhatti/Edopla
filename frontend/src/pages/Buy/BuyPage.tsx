import { Container, LinearProgress, Stack, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomFilter from "../../components/custom/CustomFilter";
import CustomSearch from "../../components/custom/CustomSearch";
import { displayError } from "../../errors/displayError";
import * as Contexts from "../../utils/contexts";
import * as BuyManipulation from "./BuyManipulation";
// import * as BuyPageHelper from "./BuyPageHelper";
import CustomSnackbar from "../../components/custom/CustomSnackbar";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Vendor } from "../../models/users/vendor";
import { getSavedVendors, toggleSavedVendor } from "../../network/users/buyers_api";
import { getAllVendors } from "../../network/users/vendors_api";
import VendorInformationCard from "../../components/card/VendorInformationCard";

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
  // State to contain information of the vendors in the cart.
  const [cartVendors, setCartVendors] = useState<Vendor[]>([]);
  // State to contain information of the saved vendors.
  const [savedVendors, setSavedVendors] = useState<Vendor[]>([]);
  // State to contain information of the unsaved vendors.
  const [unsavedVendors, setUnsavedVendors] = useState<Vendor[]>([]);

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
        setIsLoading(true); // Show the loading indicator

        // Retrieve all vendors
        const allVendors = await getAllVendors();

        // Set the vendors that exist in the cart
        const vendorsInCart: Vendor[] = carts!.map((cart) => cart.vendorId);
        setCartVendors(vendorsInCart);

        // Retrieve saved vendors
        const savedVendors: Vendor[] = await getSavedVendors();
        setSavedVendors(savedVendors);

        // Set unsaved vendors
        setUnsavedVendors(
          allVendors.filter((vendor) => {
            return !savedVendors.includes(vendor);
          })
        );
      } catch (error) {
        displayError(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadVendors();
  }, [loggedInUser, carts]);

  // /** Function to search the menu by its name or category. */
  // const handleMenuSearch = (searchValue: string): void => {
  //   BuyPageHelper.handleSearch(completeMenu, searchValue, setActiveMenu);
  // };
  // /** Array containing the price range of the menu. */
  // const priceRange: number[] = BuyManipulation.getPriceRange(completeMenu);
  // /** Array containing the categories of the menu. */
  // const categories: string[] = BuyManipulation.getCategories(completeMenu);
  // /** State to track the slider values. */
  // const [priceFilter, setPriceFilter] = useState<number[]>([priceRange[0], priceRange[1]]);
  // /** State to track the category filter. */
  // const [categoryFilter, setCategoryFilter] = useState<string>("");
  // // Callback function to be invoked when the "Apply" button is clicked in the filter
  // const handleFilterApply = () => {
  //   BuyPageHelper.applyFilter(completeMenu, priceFilter, categoryFilter, setActiveMenu);
  // };
  // /** Array of filter options. */
  // const filterOptions = BuyPageHelper.generateFilterOptions(
  //   priceRange,
  //   setPriceFilter,
  //   categories,
  //   setCategoryFilter
  // );
  // /** Array of functions to execute for each sort option when clicked. */
  // const sortFunctions: (() => void)[] = BuyPageHelper.generateSortFunctions(
  //   activeMenu,
  //   setActiveMenu
  // );

  /** UI layout for the vendor view options. */
  const vendorViewOptions = (
    <>
      {/* Search bar. */}
      <CustomSearch
        placeholder="Search"
        initialValue=""
        activeSearch={true}
        onSearch={() => {}}
        sx={{ width: "50%", mx: "auto" }}
      />

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
          filterOptions={[]}
          onApply={() => {}}
          onRemove={() => {}}
          variant="outlined"
          color="neutral"
        />

        {/* Dropdown for the sort options. */}
        <CustomDropdown
          label="Sort by"
          options={[]}
          onOptionClick={[() => {}]}
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
      const initialLength = savedVendors.length;
      const updatedLength = updatedSavedVendors.length;

      setSavedVendors(updatedSavedVendors);
      if (updatedLength > initialLength)
        setUnsavedVendors(unsavedVendors.filter((vendor) => vendor._id !== vendorToToggle._id));
      else setUnsavedVendors([...unsavedVendors, vendorToToggle]);

      // Show snackbar to indicate success.
      setSnackbarFormat({
        text: updatedLength > initialLength ? "Vendor successfully saved!" : "Vendor unsaved!",
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
  const cartVendorCards = carts!.length ? (
    <Stack id="cardVendorsSection" direction="column" gap={2}>
      <Typography level="title-lg">Continue Shopping</Typography>
      {cartVendors.map((vendor) => (
        <VendorInformationCard
          key={`cart-${vendor._id}`}
          vendor={vendor}
          isSaved={savedVendors.includes(vendor)}
          onSaveToggled={() => toggleVendor(vendor)}
          isCart={true}
        />
      ))}
    </Stack>
  ) : null;

  /** UI layout for the saved vendor cards. */
  const savedVendorCards = savedVendors.length ? (
    <Stack id="savedVendorsSection" direction="column" gap={2}>
      <Typography level="title-lg">Saved Vendors</Typography>
      {savedVendors.map((vendor) => (
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
  const unsavedVendorCards = unsavedVendors.length ? (
    <Stack id="unsavedVendorsSection" direction="column" gap={2}>
      <Typography level="title-lg">Other Vendors</Typography>
      {unsavedVendors.map((vendor) => (
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
  const snackbar = (
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
          {snackbar}

          {/* Display for the vendor view options. */}
          {vendorViewOptions}

          {/* Display for the vendor cards. */}
          <Stack direction="column" gap={4}>
            {/** Vendors in cart section. */}
            {cartVendorCards}

            {/** Saved vendors section. */}
            {savedVendorCards}

            {/** Unsaved vendors section. */}
            {unsavedVendorCards}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default BuyPage;
