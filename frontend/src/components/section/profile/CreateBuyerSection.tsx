/**************************************************************************************************
 * This file contains the UI for the create buyer section of the sign up page.                    *
 **************************************************************************************************/

import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import { Button, FormControl, FormLabel, Stack } from "@mui/joy";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayError } from "../../../errors/displayError";
import { Buyer } from "../../../models/users/buyer";
import { User } from "../../../models/users/user";
import { createBuyer } from "../../../network/users/buyers_api";
import { mobileScreenInnerWidth } from "../../../styles/TextSX";
import { snackBarColor } from "../../../utils/contexts";
import CustomInput from "../../custom/CustomInput";

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
  const [formError, setFormError] = useState<number>(0);

  /** Function to handle buyer creation submission. */
  async function handleBuyerCreation() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (phoneNumber.length && !phoneNumber.match(/^[0-9]+$/)) {
      setFormError(3);
      updateSnackbar("Please enter a valid phone number.", "danger", true);
      return;
    }
    // Reset the form error state.
    setFormError(0);

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
  const inputMinWidth = { minWidth: window.innerWidth <= mobileScreenInnerWidth ? "90%" : "70%" };
  const BuyerCreationForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleBuyerCreation();
      }}
    >
      <Stack gap={5} direction="column" alignItems="center">
        {/* Buyer name section. */}
        <FormControl sx={inputMinWidth}>
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
            error={formError === 1}
          />
        </FormControl>

        {/* Address section. */}
        <FormControl sx={inputMinWidth}>
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
              error={formError === 2}
            />
          </StandaloneSearchBox>
        </FormControl>

        {/* Phone number section. */}
        <FormControl sx={inputMinWidth}>
          <FormLabel>Phone Number</FormLabel>
          <CustomInput
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPhoneNumber(event.target.value);
            }}
            startDecorator={<PhoneIcon fontSize="small" />}
            error={formError === 3}
          />
        </FormControl>

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
      id="BuyerCreationSection"
      direction="column"
      alignItems="center"
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
      {BuyerCreationForm}
    </Stack>
  );
};

export default CreateBuyerSection;
