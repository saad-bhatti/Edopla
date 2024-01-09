/**************************************************************************************************
 * This file contains the UI for the buyer profile card.                                          *
 * The buyer profile card allows the buyer to change their name, address, and phone number.       *
 * The buyer profile card is displayed in the profiles page.                                      *
 **************************************************************************************************/

import BadgeIcon from "@mui/icons-material/Badge";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import { Button, CardContent, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { SxProps } from "@mui/joy/styles/types";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useState } from "react";
import { Buyer } from "../../models/users/buyer";
import { updateBuyer } from "../../network/users/buyers_api";
import CustomCard from "../custom/CustomCard";
import CustomInput from "../custom/CustomInput";
import CustomSnackbar from "../custom/CustomSnackbar";

/** Props of the buyer profile card component. */
interface BuyerProfileCardProps {
  buyer: Buyer;
  onBuyerUpdate: (buyer: Buyer) => void;
  sx?: SxProps;
}

/** UI component for a buyer profile card. */
const BuyerProfileCard = ({ buyer, onBuyerUpdate, sx }: BuyerProfileCardProps) => {
  // Retrieve buyer info from props.
  const { buyerName, address, phoneNumber } = buyer;
  // State to track the new buyer name input value.
  const [newBuyerName, setNewBuyerName] = useState<string>(buyerName);
  // State to track the new address input value.
  const [newAddress, setNewAddress] = useState<string>(address);
  // State to track the new phone number input value.
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(phoneNumber || "");

  // State to control errors on the buyer information form.
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

  /** Function to check whether any changes to the buyer info have been made. */
  function isChange(): boolean {
    return newBuyerName !== buyerName || newAddress !== address || newPhoneNumber !== phoneNumber;
  }

  /** Function to handle change submissions to the buyer profile. */
  async function handleProfileChange() {
    // Check that the phone number is valid, checking that it only contains numbers.
    if (!newPhoneNumber.match(/^[0-9]+$/)) {
      setFormError({ isError: 3, error: "Please enter a valid phone number." });
      return;
    }
    // If there are no errors, reset the form error state.
    setFormError({ isError: 0, error: "" });

    try {
      // Send request to backend to update buyer info.
      const requestDetails = {
        buyerName: newBuyerName,
        address: newAddress,
        phoneNumber: newPhoneNumber,
      };
      const updatedBuyer: Buyer = await updateBuyer(requestDetails);
      onBuyerUpdate(updatedBuyer);

      // Show snackbar to indicate success.
      setSnackbarFormat({
        text: "Buyer profile updated successfully!",
        color: "success",
      });
      setSnackbarVisible(true);
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to update buyer profile.",
        color: "danger",
      });
      setSnackbarVisible(true);
    }
  }

  /** UI layout for the buyer name section. */
  const BuyerNameSection = (
    <>
      {/* Buyer name section title. */}
      <FormLabel>Buyer Name</FormLabel>
      {/* Buyer name input. */}
      <FormControl error={formError.isError === 1}>
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
      <FormHelperText>
        <InfoOutlined fontSize="small" />
        Your name will be visible to vendors.
      </FormHelperText>
    </>
  );

  /** UI layout for the address section. */
  const AddressSection = (
    <>
      {/* Address section title. */}
      <FormLabel>Address</FormLabel>
      {/* Address input. */}
      <FormControl error={formError.isError === 2}>
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
            startDecorator={<BadgeIcon fontSize="small" />}
            required={true}
          />
        </StandaloneSearchBox>
      </FormControl>
      {/* Address helper text. */}
      <FormHelperText>
        <InfoOutlined fontSize="small" />
        Your address is not visible to any vendor or buyer.
      </FormHelperText>
    </>
  );

  /** UI layout for the phone number section. */
  const PhoneNumberSection = (
    <>
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
      {/* Phone number helper text. */}
      <FormHelperText>
        <InfoOutlined fontSize="small" />
        Your phone number is not visible to any vendor or buyer.
      </FormHelperText>
    </>
  );

  /** UI layout for the change buyer information form. */
  const changeBuyerInfoForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleProfileChange();
      }}
    >
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
  const cardContent = <CardContent>{changeBuyerInfoForm}</CardContent>;

  /** UI layout for the buyer info snackbar. */
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
      {/* Display the password snackbar. */}
      {snackbar}

      {/* Display the buyer profile card. */}
      <CustomCard cardContent={cardContent} sx={sx} />
    </>
  );
};

export default BuyerProfileCard;
