/**************************************************************************************************
 * This file contains the UI for the vendor profile card.                                         *
 * The vendor profile card allows the vendor to change their details.                             *
 * The vendor profile card is displayed in the profiles page.                                     *
 **************************************************************************************************/

import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import { Button, CardContent, FormControl, FormLabel, Textarea } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { Vendor } from "../../models/users/vendor";
import { updateVendor } from "../../network/users/vendors_api";
import { InfoHelperText, mobileScreenInnerWidth } from "../../styles/TextSX";
import { snackBarColor } from "../../utils/contexts";
import CustomCard from "../custom/CustomCard";
import CustomDropdown from "../custom/CustomDropdown";
import CustomInput from "../custom/CustomInput";

/** Props of the vendor profile card component. */
interface VendorProfileCardProps {
  vendor: Vendor;
  onVendorUpdate: (vendor: Vendor) => void;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
  sx?: SxProps;
}

/** UI component for a vendor profile card. */
const VendorProfileCard = ({
  vendor,
  onVendorUpdate,
  updateSnackbar,
  sx,
}: VendorProfileCardProps) => {
  // Retrieve vendor info from props.
  const { vendorName, address, phoneNumber, priceRange, description, cuisineTypes } = vendor;
  // State to track the new vendor name input value.
  const [newVendorName, setNewVendorName] = useState<string>(vendorName);
  // State to track the new address input value.
  const [newAddress, setNewAddress] = useState<string>(address);
  // State to track the new phone number input value.
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(phoneNumber || "");
  // State to track the new price range input value.
  const [newPriceRange, setNewPriceRange] = useState<string>(priceRange);
  // State to track the new description input value.
  const [newDescription, setNewDescription] = useState<string>(description || "");
  // State to track the individual cuisine type input value.
  const [newCuisine, setNewCuisine] = useState<string>("");
  // State to track the new cuisine types input value.
  const [newCuisineTypes, setNewCuisineTypes] = useState<string[]>(cuisineTypes);

  /** Function to check whether any changes to the vendor info have been made. */
  function isChange(): boolean {
    return (
      newVendorName !== vendorName ||
      newAddress !== address ||
      newPhoneNumber !== phoneNumber ||
      newPriceRange !== priceRange ||
      newDescription !== description ||
      newCuisineTypes !== cuisineTypes
    );
  }

  /** Function to handle change submissions to the vendor profile. */
  async function handleProfileChange() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (newPhoneNumber.length && !newPhoneNumber.match(/^[0-9]+$/)) {
      updateSnackbar("Please enter a valid phone number.", "danger", true);
      return;
    }

    try {
      // Send request to backend to update vendor info.
      const requestDetails = {
        vendorName: newVendorName,
        address: newAddress,
        phoneNumber: newPhoneNumber,
        priceRange: newPriceRange,
        description: newDescription,
        cuisineTypes: newCuisineTypes,
      };
      const updatedVendor: Vendor = await updateVendor(requestDetails);
      onVendorUpdate(updatedVendor);

      // Show snackbar to indicate success.
      updateSnackbar("Vendor profile updated successfully!", "success", true);
    } catch (error) {
      // Show snackbar to indicate failure.
      updateSnackbar("Failed to update vendor profile.", "danger", true);
    }
  }

  /** UI layout for the vendor name section. */
  const VendorNameSection = (
    <>
      {/* Vendor name section title. */}
      <FormLabel>Name *</FormLabel>
      {/* Vendor name input. */}
      <FormControl>
        <CustomInput
          type="text"
          placeholder="Name"
          value={newVendorName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewVendorName(event.target.value);
          }}
          startDecorator={<BadgeIcon fontSize="small" />}
          required={true}
        />
      </FormControl>
    </>
  );

  /** UI layout for the address section. */
  const AddressSection = (
    <>
      {/* Address section title. */}
      <FormLabel>Address *</FormLabel>
      {/* Address input. */}
      <FormControl>
        <StandaloneSearchBox
          onLoad={(ref) => {
            ref.addListener("places_changed", () => {
              const places = ref.getPlaces();
              if (!places || places.length === 0) return;
              const place = places[0];
              const address = place.formatted_address;
              if (address) setNewAddress(address);
            });
          }}
        >
          <CustomInput
            type="text"
            placeholder="Address"
            value={newAddress}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewAddress(event.target.value);
            }}
            startDecorator={<LocationOnIcon fontSize="small" />}
            required={true}
          />
        </StandaloneSearchBox>
      </FormControl>
    </>
  );

  /** UI layout for the phone number section. */
  const PhoneNumberSection = (
    <>
      {/* Phone number section title. */}
      <FormLabel>Phone Number</FormLabel>
      {/* Phone number input. */}
      <FormControl>
        <CustomInput
          type="tel"
          placeholder="Phone Number"
          value={newPhoneNumber}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPhoneNumber(event.target.value);
          }}
          startDecorator={<PhoneIcon fontSize="small" />}
        />
      </FormControl>
    </>
  );

  /** UI layout for the price range section. */
  const PriceRangeSection = (
    <>
      {/* Price range section title. */}
      <FormLabel>Price Range *</FormLabel>
      {/* Price range input. */}
      <FormControl sx={{ maxWidth: "50%" }}>
        <CustomDropdown
          label={`Price range: ${newPriceRange}`}
          options={["$", "$$", "$$$"]}
          onOptionClick={[
            () => setNewPriceRange("$"),
            () => setNewPriceRange("$$"),
            () => setNewPriceRange("$$$"),
          ]}
          variant="outlined"
          color="primary"
        />
      </FormControl>
    </>
  );

  /** UI layout for the description section. */
  const DescriptonSection = (
    <>
      {/* Description section title. */}
      <FormLabel>Description *</FormLabel>
      {/* Description input. */}
      <FormControl>
        <Textarea
          color="neutral"
          size="sm"
          variant="outlined"
          placeholder="Description"
          value={newDescription}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNewDescription(event.target.value);
          }}
          minRows={2}
          required
        />
      </FormControl>
    </>
  );

  /** UI layout for the cuisine types section. */
  const CuisineTypesSection = (
    <>
      {/* Cuisine types section title. */}
      <FormLabel>Cuisine Types</FormLabel>
      <FormControl>
        {/* New cuisine input. */}
        <Stack direction="row" mb={1}>
          {/* Cuisine input. */}
          <CustomInput
            type="text"
            placeholder="Cuisine Types"
            value={newCuisine}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewCuisine(event.target.value);
            }}
            startDecorator={<MenuBookIcon fontSize="small" />}
          />
          {/* Cuisine button. */}
          <Button
            type="button"
            variant="outlined"
            size="sm"
            onClick={() => {
              // Check if the cuisine type is already in the list.
              if (newCuisineTypes.includes(newCuisine)) {
                updateSnackbar("Cuisine type already exists.", "danger", true);
                return;
              }
              // Otherwise, add the cuisine type to the list and reset error state.
              setNewCuisineTypes([...newCuisineTypes, newCuisine]);
              setNewCuisine("");
            }}
          >
            Add
          </Button>
        </Stack>
        {/* Existing cuisine types display. */}
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
          {newCuisineTypes.map((cuisine, index) => (
            <Button
              key={index}
              variant="outlined"
              size="sm"
              onClick={() => {
                setNewCuisineTypes(
                  newCuisineTypes.filter((traversalCuisine) => traversalCuisine !== cuisine)
                );
              }}
              endDecorator={<CloseIcon fontSize="small" />}
            >
              {cuisine}
            </Button>
          ))}
        </Stack>
      </FormControl>
    </>
  );

  /** UI layout for the change vendor information form. */
  const ChangeVendorInfoForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleProfileChange();
      }}
    >
      {/* Dislaimer text. */}
      <InfoHelperText children="Your profile details are visible to buyers." sx={{ mb: 2 }} />

      <Stack spacing={1} direction="column" mb={1}>
        {/* Vendor name section. */}
        {VendorNameSection}

        {/* Address section. */}
        {AddressSection}

        {/* Phone number section. */}
        {PhoneNumberSection}

        {/* Price range section. */}
        {PriceRangeSection}

        {/* Description section. */}
        {DescriptonSection}

        {/* Cuisine types section. */}
        {CuisineTypesSection}

        {/* Submit button. */}
        {isChange() && (
          <Button
            type="submit"
            variant="solid"
            size="sm"
            sx={{ alignSelf: "flex-end" }}
            startDecorator={<SaveIcon fontSize="small" />}
          >
            Update Profile
          </Button>
        )}
      </Stack>
    </form>
  );

  /** UI layout for the vendor profile card. */
  const VendorCardContent = <CardContent>{ChangeVendorInfoForm}</CardContent>;

  /** Custom styling for the card. */
  const customSx: SxProps = {
    maxWidth: window.innerWidth <= mobileScreenInnerWidth ? "100%" : "70%",
    margin: "auto",
    ...sx,
  };

  /** UI layout for the card. */
  return <CustomCard cardContent={VendorCardContent} sx={customSx} />;
};

export default VendorProfileCard;
