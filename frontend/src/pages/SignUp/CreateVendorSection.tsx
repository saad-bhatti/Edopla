import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import { Button, FormControl, FormHelperText, FormLabel, Stack, Textarea } from "@mui/joy";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomInput from "../../components/custom/CustomInput";
import { displayError } from "../../errors/displayError";
import { User } from "../../models/users/user";
import { Vendor } from "../../models/users/vendor";
import { createVendor } from "../../network/users/vendors_api";

/** Props of the vendor profile section. */
interface CreateVendorSectionProps {
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
  setSnackbarFormat: React.Dispatch<
    React.SetStateAction<{
      text: string;
      color: "primary" | "neutral" | "danger" | "success" | "warning";
    }>
  >;
  setSnackbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

/** UI for the create vendor section. */
const CreateVendorSection = ({
  setLoggedInUser,
  setSnackbarFormat,
  setSnackbarVisible,
}: CreateVendorSectionProps) => {
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
  const [formError, setFormError] = useState<{ isError: number; error: string }>({
    isError: 0,
    error: "",
  });

  /** Function to handle vendor creation submission. */
  async function handleVendorCreation() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (phoneNumber.length && !phoneNumber.match(/^[0-9]+$/)) {
      setFormError({ isError: 3, error: "Please enter a valid phone number." });
      return;
    }
    // Reset the form error state.
    setFormError({ isError: 0, error: "" });

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
      setLoggedInUser((user: User | null) => {
        user!._vendor = newVendor._id;
        return user;
      });

      // Show success snackbar.
      setSnackbarFormat({
        text: "Successfully created a vendor profile!",
        color: "success",
      });
      setSnackbarVisible(true);

      // Wait for 3 seconds and then navigate to the home page.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setSnackbarFormat({
          text: error.message,
          color: "danger",
        });
        setSnackbarVisible(true);
      } else displayError(error);
    }
  }

  /** UI layout for the vendor creation form. */
  const vendorCreationForm = (
    <form
      style={{ width: "100%", margin: "auto", padding: "0% 5%" }}
      onSubmit={(event) => {
        event.preventDefault();
        handleVendorCreation();
      }}
    >
      {/* Container for whole form. */}
      <Stack direction="column" gap={4}>
        {/* Form error text. */}
        {formError.isError !== 0 && (
          <FormControl error sx={{ alignSelf: "center" }}>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {formError.error}
            </FormHelperText>
          </FormControl>
        )}

        {/* Container for both columns of the form. */}
        <Stack direction="row" justifyContent="space-between">
          {/* Left column of the form. */}
          <Stack gap={3} direction="column" alignItems="flex-start" maxWidth="60%">
            {/* Vendor name section. */}
            <FormControl error={formError.isError === 1}>
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

            {/* Phone number section. */}
            <FormControl error={formError.isError === 3}>
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

            {/* Description section. */}
            <FormControl error={formError.isError === 5}>
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
          </Stack>

          {/* Right column of the form. */}
          <Stack gap={3} direction="column" alignItems="flex-start" maxWidth="40%">
            {/* Address section. */}
            <FormControl error={formError.isError === 2}>
              <FormLabel>Address *</FormLabel>
              <CustomInput
                type="address"
                placeholder="Address"
                value={address}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress(event.target.value);
                }}
                startDecorator={<LocationOnIcon fontSize="small" />}
                required={true}
              />
            </FormControl>

            {/* Price range section. */}
            <FormControl error={formError.isError === 4}>
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

            {/* Cuisine types section. */}
            <FormControl error={formError.isError === 6}>
              <FormLabel>Cuisine Types</FormLabel>
              {/* New cuisine input. */}
              <Stack direction="row" marginBottom={1}>
                {/* Cuisine input. */}
                <CustomInput
                  type="text"
                  placeholder="Cuisine Types"
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
                      setFormError({
                        isError: 6,
                        error: "Cuisine type already exists.",
                      });
                      return;
                    }
                    // Otherwise, add the cuisine type to the list and reset error state.
                    setCuisineTypes([...cuisineTypes, cuisine]);
                    setCuisine("");
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
        minWidth: "50vw",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        minHeight: "75vh",
      }}
    >
      {vendorCreationForm}
    </Stack>
  );
};

export default CreateVendorSection;
