/**************************************************************************************************
 * This file contains the UI for the buyer profile card.                                          *
 * The buyer profile card allows the buyer to change their name, address, and phone number.       *
 * The buyer profile card is displayed in the profiles page.                                      *
 **************************************************************************************************/

import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import { Button, CardContent, FormControl, FormLabel } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { Buyer } from "../../models/users/buyer";
import { updateBuyer } from "../../network/users/buyers_api";
import { InfoHelperText, mobileScreenInnerWidth } from "../../styles/TextSX";
import { snackBarColor } from "../../utils/contexts";
import CustomCard from "../custom/CustomCard";
import CustomInput from "../custom/CustomInput";

/** Props of the buyer profile card component. */
interface BuyerProfileCardProps {
  buyer: Buyer;
  onBuyerUpdate: (buyer: Buyer) => void;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
  sx?: SxProps;
}

/** UI component for a buyer profile card. */
const BuyerProfileCard = ({ buyer, onBuyerUpdate, updateSnackbar, sx }: BuyerProfileCardProps) => {
  // Retrieve buyer info from props.
  const { buyerName, address, phoneNumber } = buyer;
  // State to track the new buyer name input value.
  const [newBuyerName, setNewBuyerName] = useState<string>(buyerName);
  // State to track the new address input value.
  const [newAddress, setNewAddress] = useState<string>(address);
  // State to track the new phone number input value.
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(phoneNumber || "");

  /** Function to check whether any changes to the buyer info have been made. */
  function isChange(): boolean {
    return newBuyerName !== buyerName || newAddress !== address || newPhoneNumber !== phoneNumber;
  }

  /** Function to handle change submissions to the buyer profile. */
  async function handleProfileChange() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (newPhoneNumber.length && !newPhoneNumber.match(/^[0-9]+$/)) {
      updateSnackbar("Please enter a valid phone number.", "danger", true);
      return;
    }

    try {
      // Send request to backend to update buyer info.
      const requestDetails = {
        buyerName: newBuyerName,
        address: newAddress,
        phoneNumber: newPhoneNumber,
      };
      const updatedBuyer: Buyer = await updateBuyer(requestDetails);
      onBuyerUpdate(updatedBuyer);

      // Show success snackbar.
      updateSnackbar("Buyer profile updated successfully!", "success", true);
    } catch (error) {
      // Show error snackbar.
      updateSnackbar("Failed to update buyer profile.", "danger", true);
    }
  }

  /** UI layout for the buyer name section. */
  const BuyerNameSection = (
    <Stack direction="column" gap={1}>
      {/* Buyer name section title. */}
      <FormLabel>Name *</FormLabel>
      {/* Buyer name input. */}
      <FormControl>
        <CustomInput
          type="text"
          placeholder="Name"
          value={newBuyerName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNewBuyerName(event.target.value);
          }}
          startDecorator={<BadgeIcon fontSize="small" />}
          required={true}
        />
      </FormControl>
      {/* Buyer name helper text. */}
      <InfoHelperText children="Your name will be visible to vendors." />
    </Stack>
  );

  /** UI layout for the address section. */
  const AddressSection = (
    <Stack direction="column" gap={1}>
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
      {/* Address helper text. */}
      <InfoHelperText children="Your address is not visible to any vendor or buyer." />
    </Stack>
  );

  /** UI layout for the phone number section. */
  const PhoneNumberSection = (
    <Stack direction="column" gap={1}>
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
      {/* Phone number helper text. */}
      <InfoHelperText children="Your phone number is not visible to any vendor or buyer." />
    </Stack>
  );

  /** UI layout for the change buyer information form. */
  const ChangeBuyerInfoForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleProfileChange();
      }}
    >
      <Stack gap={3} direction="column" mb={1}>
        {/* Buyer name section. */}
        {BuyerNameSection}

        {/* Address section. */}
        {AddressSection}

        {/* Phone number section. */}
        {PhoneNumberSection}

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

  /** UI layout for the buyer profile card. */
  const BuyerCardContent = <CardContent>{ChangeBuyerInfoForm}</CardContent>;

  /** Custom styling for the card. */
  const customSx: SxProps = {
    maxWidth: window.innerWidth <= mobileScreenInnerWidth ? "100%" : "70%",
    margin: "auto",
    ...sx,
  };

  /** UI layout for the card. */
  return <CustomCard cardContent={BuyerCardContent} sx={customSx} />;
};

export default BuyerProfileCard;
