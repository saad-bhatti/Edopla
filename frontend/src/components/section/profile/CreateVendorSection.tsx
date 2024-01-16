/**************************************************************************************************
 * This file contains the UI for the create vendor section of the sign up page.                   *
 **************************************************************************************************/

import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import { Button, FormControl, FormLabel, Stack, Textarea } from "@mui/joy";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayError } from "../../../errors/displayError";
import { User } from "../../../models/users/user";
import { Vendor } from "../../../models/users/vendor";
import { createVendor } from "../../../network/users/vendors_api";
import { mobileScreenInnerWidth } from "../../../styles/TextSX";
import { snackBarColor } from "../../../utils/contexts";
import CustomDropdown from "../../custom/CustomDropdown";
import CustomInput from "../../custom/CustomInput";

/** Props of the vendor profile section. */
interface CreateVendorSectionProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
}

/** UI for the create vendor section. */
const CreateVendorSection = ({ setUser, updateSnackbar }: CreateVendorSectionProps) => {
  // Variable to navigate to other pages
  const navigate = useNavigate();
  // State to track the vendor name input value.
  const [vendorName, setVendorName] = useState<string>("");
  // State to track the address input value.
  const [address, setAddress] = useState<string>("");
  // State to track the phone number input value.
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  // State to track the price range input value.
  const [priceRange, setPriceRange] = useState<string>("");
  // State to track the description input value.
  const [description, setDescription] = useState<string>("");
  // State to track the individual cuisine type input value.
  const [cuisine, setCuisine] = useState<string>("");
  // State to track the cuisine types input value.
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  // State to control errors on the vendor information form.
  const [formError, setFormError] = useState<number>(0);

  /** Function to handle vendor creation submission. */
  async function handleVendorCreation() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (phoneNumber.length && !phoneNumber.match(/^[0-9]+$/)) {
      setFormError(3);
      updateSnackbar("Please enter a valid phone number.", "danger", true);
      return;
    }
    // Reset the form error state.
    setFormError(0);

    try {
      // Send request to backend to create the new vendor profile.
      const requestDetails = {
        vendorName: vendorName,
        address: address,
        phoneNumber: phoneNumber,
        priceRange: priceRange,
        description: description,
        cuisineTypes: cuisineTypes,
      };
      const newVendor: Vendor = await createVendor(requestDetails);
      setUser((user: User | null) => {
        user!._vendor = newVendor._id;
        return user;
      });

      // Show success snackbar.
      updateSnackbar("Successfully created a vendor profile!", "success", true);

      // Navigate to the home page.
      navigate("/");
    } catch (error) {
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
    }
  }

  /** UI layout for the vendor creation form. */
  const inputMinWidth = { minWidth: window.innerWidth <= mobileScreenInnerWidth ? "90%" : "70%" };
  const vendorCreationForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleVendorCreation();
      }}
    >
      {/* Container for whole form. */}
      <Stack direction="column" gap={4}>
        {/* Fields containing the vendor's information. */}
        <Stack gap={3} direction="column" alignItems="flex-start">
          {/* Vendor name section. */}
          <FormControl error={formError === 1} sx={inputMinWidth}>
            <FormLabel>Name *</FormLabel>
            <CustomInput
              type="text"
              placeholder="Name"
              value={vendorName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setVendorName(event.target.value);
              }}
              startDecorator={<BadgeIcon fontSize="small" />}
              required={true}
            />
          </FormControl>

          {/* Address section. */}
          <FormControl error={formError === 2} sx={inputMinWidth}>
            <FormLabel>Address *</FormLabel>
            <StandaloneSearchBox
              onLoad={(ref) => {
                ref.addListener("places_changed", () => {
                  const places = ref.getPlaces();
                  if (!places || places.length === 0) return;
                  const place = places[0];
                  const address = place.formatted_address;
                  if (address) setAddress(address);
                });
              }}
            >
              <CustomInput
                type="text"
                placeholder="Address"
                value={address}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress(event.target.value);
                }}
                startDecorator={<LocationOnIcon fontSize="small" />}
                required={true}
              />
            </StandaloneSearchBox>
          </FormControl>

          {/* Phone number section. */}
          <FormControl error={formError === 3} sx={inputMinWidth}>
            <FormLabel>Phone Number</FormLabel>
            <CustomInput
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPhoneNumber(event.target.value);
              }}
              startDecorator={<PhoneIcon fontSize="small" />}
            />
          </FormControl>

          {/* Price range section. */}
          <FormControl error={formError === 4} sx={inputMinWidth}>
            <FormLabel>Price Range *</FormLabel>
            <CustomDropdown
              label={`Price range: ${priceRange}`}
              options={["$", "$$", "$$$"]}
              onOptionClick={[
                () => setPriceRange("$"),
                () => setPriceRange("$$"),
                () => setPriceRange("$$$"),
              ]}
              variant="outlined"
              color="primary"
            />
          </FormControl>

          {/* Description section. */}
          <FormControl error={formError === 5} sx={inputMinWidth}>
            <FormLabel>Description *</FormLabel>
            <Textarea
              color="neutral"
              size="sm"
              variant="outlined"
              placeholder="Description"
              value={description}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDescription(event.target.value);
              }}
              minRows={2}
              required
            />
          </FormControl>

          {/* Cuisine types section. */}
          <FormControl
            error={formError === 6}
            sx={{ maxWidth: "100%" }}
          >
            <FormLabel>Cuisine Types</FormLabel>
            {/* New cuisine input. */}
            <Stack direction="row" mb={1}>
              {/* Cuisine input. */}
              <CustomInput
                type="text"
                placeholder="Enter a Cuisine Type"
                value={cuisine}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCuisine(event.target.value);
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
                  if (cuisineTypes.includes(cuisine)) {
                    setFormError(6);
                    updateSnackbar("Cuisine type already exists.", "danger", true);
                    return;
                  }
                  // Otherwise, add the cuisine type to the list and reset error state.
                  setCuisineTypes([...cuisineTypes, cuisine]);
                  setCuisine("");
                  if (formError === 6) {
                    setFormError(0);
                  }
                }}
              >
                Add
              </Button>
            </Stack>
            {/* Existing cuisine types display. */}
            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
              {cuisineTypes.map((cuisine, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="sm"
                  onClick={() => {
                    setCuisineTypes(
                      cuisineTypes.filter((traversalCuisine) => traversalCuisine !== cuisine)
                    );
                  }}
                  endDecorator={<CloseIcon fontSize="small" />}
                >
                  {cuisine}
                </Button>
              ))}
            </Stack>
          </FormControl>
        </Stack>

        {/* Create profile button. */}
        <Button
          type="submit"
          variant="solid"
          color="primary"
          sx={{ alignSelf: "center", minWidth: "50%" }}
        >
          Create Profile
        </Button>
      </Stack>
    </form>
  );

  return (
    <Stack
      id="VendorCreationSection"
      direction="column"
      gap={3}
      sx={{
        minWidth: window.innerWidth <= mobileScreenInnerWidth ? "90%" : "50%",
        minHeight: window.innerWidth <= mobileScreenInnerWidth ? "60vh" : "65vh",
        px: window.innerWidth <= mobileScreenInnerWidth ? "5%" : "2%",
        py: window.innerWidth <= mobileScreenInnerWidth ? "7%" : "3%",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
      }}
    >
      {vendorCreationForm}
    </Stack>
  );
};

export default CreateVendorSection;
