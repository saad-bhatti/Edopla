/**************************************************************************************************
 * This file contains the UI for the create buyer section of the sign up page.                    *
 **************************************************************************************************/

import BadgeIcon from "@mui/icons-material/Badge";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Button, FormControl, FormHelperText, FormLabel, Stack } from "@mui/joy";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../custom/CustomInput";
import { displayError } from "../../../errors/displayError";
import { Buyer } from "../../../models/users/buyer";
import { User } from "../../../models/users/user";
import { createBuyer } from "../../../network/users/buyers_api";
import { snackBarColor } from "../../../utils/contexts";

/** Props of the buyer profile section. */
interface CreateBuyerSectionProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
}

/** UI for the create buyer section. */
const CreateBuyerSection = ({ setUser, updateSnackbar }: CreateBuyerSectionProps) => {
  // Variable to navigate to other pages
  const navigate = useNavigate();
  // State to track the new buyer name input value.
  const [buyerName, setBuyerName] = useState<string>("");
  // State to track the new address input value.
  const [address, setAddress] = useState<string>("");
  // State to track the new phone number input value.
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  // State to control errors on the sign up information form.
  const [formError, setFormError] = useState<{ isError: number; error: string }>({
    isError: 0,
    error: "",
  });

  /** Function to handle buyer creation submission. */
  async function handleBuyerCreation() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (phoneNumber.length && !phoneNumber.match(/^[0-9]+$/)) {
      setFormError({ isError: 3, error: "Please enter a valid phone number." });
      return;
    }
    // Reset the form error state.
    setFormError({ isError: 0, error: "" });

    try {
      // Send request to backend to create the new buyer profile.
      const requestDetails = {
        buyerName: buyerName,
        address: address,
        phoneNumber: phoneNumber,
      };
      const newBuyer: Buyer = await createBuyer(requestDetails);
      setUser((user: User | null) => {
        user!._buyer = newBuyer._id;
        return user;
      });

      // Show success snackbar.
      updateSnackbar("Successfully created a buyer profile!", "success", true);

      // Navigate to the home page.
      navigate("/");
    } catch (error) {
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
    }
  }

  /** UI layout for the buyer creation form. */
  const BuyerCreationForm = (
    <form
      style={{ minWidth: "100%", margin: "auto", padding: "0% 5%" }}
      onSubmit={(event) => {
        event.preventDefault();
        handleBuyerCreation();
      }}
    >
      <Stack gap={5} direction="column" alignItems="center">
        {/* Form error text. */}
        {formError.isError !== 0 && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {formError.error}
            </FormHelperText>
          </FormControl>
        )}

        {/* Buyer name section. */}
        <FormControl>
          <FormLabel>Name *</FormLabel>
          <CustomInput
            type="text"
            placeholder="Name"
            value={buyerName}
            onChange={(event) => {
              setBuyerName(event.target.value);
            }}
            startDecorator={<BadgeIcon fontSize="small" />}
            required={true}
            error={formError.isError === 1}
            sx={{ minWidth: "30vw" }}
          />
        </FormControl>

        {/* Address section. */}
        <FormControl>
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
              sx={{ minWidth: "30vw" }}
            />
          </StandaloneSearchBox>
        </FormControl>

        {/* Phone number section. */}
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <CustomInput
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPhoneNumber(event.target.value);
            }}
            startDecorator={<PhoneIcon fontSize="small" />}
            sx={{ minWidth: "30vw" }}
          />
        </FormControl>

        {/* Create profile button. */}
        <Button type="submit" variant="solid" color="primary" sx={{ minWidth: "20vw" }}>
          Create Profile
        </Button>
      </Stack>
    </form>
  );

  return (
    <Stack
      id="BuyerCreationSection"
      direction="column"
      alignItems="center"
      gap={3}
      sx={{
        minWidth: "50vw",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        padding: "1% 0%",
        minHeight: "60vh",
      }}
    >
      {BuyerCreationForm}
    </Stack>
  );
};

export default CreateBuyerSection;
