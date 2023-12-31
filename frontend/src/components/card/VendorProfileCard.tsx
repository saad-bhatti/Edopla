import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import { Button, CardContent, FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";
import { Vendor } from "../../models/users/vendor";
import { updateVendor } from "../../network/users/vendors_api";
import CustomCard from "../custom/CustomCard";
import CustomDropdown from "../custom/CustomDropdown";
import CustomInput from "../custom/CustomInput";
import CustomSnackbar from "../custom/CustomSnackbar";

/** Props of the vendor profile card component. */
interface VendorProfileCardProps {
  vendor: Vendor;
  onVendorUpdate: (vendor: Vendor) => void;
  sx?: SxProps;
}

/** UI component for a vendor profile card. */
const VendorProfileCard = ({ vendor, onVendorUpdate, sx }: VendorProfileCardProps) => {
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

  // State to control errors on the vendor information form.
  const [formError, setFormError] = useState<{ isError: number; error: string }>({
    isError: 0,
    error: "",
  });

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
    if (!newPhoneNumber.match(/^[0-9]+$/)) {
      setFormError({ isError: 3, error: "Please enter a valid phone number." });
      return;
    }
    // If there are no errors, reset the form error state.
    setFormError({ isError: 0, error: "" });
    
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
      setSnackbarFormat({
        text: "Vendor profile updated successfully!",
        color: "success",
      });
      setSnackbarVisible(true);
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to update vendor profile.",
        color: "danger",
      });
      setSnackbarVisible(true);
    }
  }

  /** UI layout for the change vendor information form. */
  const changeVendorInfoForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleProfileChange();
      }}
    >
      {/* Dislaimer text. */}
      <FormHelperText sx={{ marginBottom: 2 }}>
        <InfoOutlined fontSize="small" />
        Your profile details are visible to buyers.
      </FormHelperText>

      <Stack spacing={1} direction="column" marginBottom={1} sx={{ maxWidth: "40%" }}>
        {/* Form error text. */}
        {formError.isError !== 0 && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {formError.error}
            </FormHelperText>
          </FormControl>
        )}

        {/* Vendor name section title. */}
        <FormLabel>Vendor Name</FormLabel>
        {/* Vendor name input. */}
        <FormControl error={formError.isError === 1}>
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

        {/* Address section title. */}
        <FormLabel>Address</FormLabel>
        {/* Address input. */}
        <FormControl error={formError.isError === 2}>
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
        </FormControl>

        {/* Phone number section title. */}
        <FormLabel>Phone Number</FormLabel>
        {/* Phone number input. */}
        <FormControl error={formError.isError === 3}>
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

        {/* Price range section title. */}
        <FormLabel>Price Range</FormLabel>
        {/* Price range input. */}
        <FormControl sx={{ maxWidth: "30%" }} error={formError.isError === 4}>
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

        {/* Description section title. */}
        <FormLabel>Description</FormLabel>
        {/* Description input. */}
        <FormControl error={formError.isError === 5}>
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

        {/* Cuisine types section title. */}
        <FormLabel>Cuisine Types</FormLabel>
        <FormControl error={formError.isError === 6}>
          {/* New cuisine input. */}
          <Stack direction="row" marginBottom={1}>
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
                  setFormError({
                    isError: 6,
                    error: "Cuisine type already exists.",
                  });
                  return;
                }
                // Otherwise, add the cuisine type to the list and reset error state.
                setNewCuisineTypes([...newCuisineTypes, newCuisine]);
                setNewCuisine("");
                if (formError.isError === 6) {
                  setFormError({
                    isError: 0,
                    error: "",
                  });
                }
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
  const cardContent = <CardContent>{changeVendorInfoForm}</CardContent>;

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

  /** UI layout for the card. */
  return (
    <>
      {/* Display the snackbar. */}
      {snackbar}

      {/* Display the vendor profile card. */}
      <CustomCard cardContent={cardContent} sx={sx} />
    </>
  );
};

export default VendorProfileCard;
