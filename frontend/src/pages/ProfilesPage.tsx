/**************************************************************************************************
 * This file contains the UI for the profiles page.                                               *
 * This page is used to display and change the user, buyer, and vendor profile information.       *
 **************************************************************************************************/

import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Container, LinearProgress, Stack } from "@mui/joy";
import { SxProps, Theme } from "@mui/joy/styles/types";
import { useContext, useEffect, useState } from "react";
import BuyerProfileCard from "../components/card/BuyerProfileCard";
import UserProfileCard from "../components/card/UserProfileCard";
import VendorProfileCard from "../components/card/VendorProfileCard";
import CustomTabs from "../components/custom/CustomTabs";
import { displayError } from "../errors/displayError";
import { Buyer } from "../models/users/buyer";
import { Vendor } from "../models/users/vendor";
import { getBuyer } from "../network/users/buyers_api";
import { getVendor } from "../network/users/vendors_api";
import { onlyBackgroundSx } from "../styles/PageSX";
import { SectionTitleText } from "../styles/Text";
import { minPageHeight, minPageWidth } from "../styles/constants";
import { SnackbarContext, UserContext, snackBarColor } from "../utils/contexts";

/** UI for the profiles page, depending on user's login status. */
const ProfilesPage = () => {
  // Retrieve the logged in user from the context
  const { user } = useContext(UserContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(SnackbarContext) || {};
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showLoadingError, setShowLoadingError] = useState(false);
  // State to track the user's buyer profile.
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  // State to track the user's vendor profile.
  const [vendor, setVendor] = useState<Vendor | null>(null);

  /** Retrieve the buyer and vendor profiles only once before rendering the page. */
  useEffect(() => {
    async function loadProfiles() {
      try {
        if (user) {
          setShowLoadingError(false);
          setIsLoading(true);

          if (user._buyer) {
            const buyer = await getBuyer();
            setBuyer(buyer);
          }

          if (user._vendor) {
            const vendor = await getVendor();
            setVendor(vendor);
          }
        }
      } catch (error) {
        displayError(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadProfiles();
  }, [user]);

  /** Function to update the snackbar. */
  function updateSnackbar(text: string, color: snackBarColor, visible: boolean) {
    setSnackbar!({ text, color, visible });
  }

  /** Sx for when a loading error occurs. */
  const errorSx: SxProps = (theme: Theme) => ({
    ...onlyBackgroundSx(theme),
    margin: 0,
    minHeight: minPageHeight,
  });

  /** Sx for the profiles page. */
  const customSx: SxProps = {
    py: 5,
    minWidth: minPageWidth,
    minHeight: minPageHeight,
  };

  return (
    <>
      {/* Display for the indicator while vendors are loading. */}
      {isLoading && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for when the profiles fail to load. */}
      {showLoadingError && (
        <Stack
          id="ProfilesPage"
          direction="row"
          justifyContent="center"
          gap={5}
          py={10}
          sx={errorSx}
        >
          <SentimentVeryDissatisfiedIcon sx={{ fontSize: "20vh" }} />
          <SectionTitleText>Something went wrong. Please try again.</SectionTitleText>
        </Stack>
      )}

      {/* Display each profile's information. */}
      {!isLoading && !showLoadingError && user && (
        <Container id="ProfilesPage" sx={customSx}>
          {/* Tabs for the profile page. */}
          <CustomTabs
            tabs={[
              // Display the user profile card.
              {
                tab: "User",
                panel: user && <UserProfileCard user={user} updateSnackbar={updateSnackbar} />,
              },
              // Display the buyer profile card.
              {
                tab: "Buyer",
                panel: buyer && (
                  <BuyerProfileCard
                    buyer={buyer}
                    onBuyerUpdate={setBuyer}
                    updateSnackbar={updateSnackbar}
                  />
                ),
              },
              // Display the vendor profile card.
              {
                tab: "Vendor",
                panel: vendor && (
                  <VendorProfileCard
                    vendor={vendor}
                    onVendorUpdate={setVendor}
                    updateSnackbar={updateSnackbar}
                  />
                ),
              },
            ]}
            sx={{ marginBottom: "10px" }}
          />
        </Container>
      )}
    </>
  );
};

export default ProfilesPage;
