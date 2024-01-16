/**************************************************************************************************
 * This file contains the UI for the profiles page.                                               *
 * This page is used to display and change the user, buyer, and vendor profile information.       *
 **************************************************************************************************/

import { Button, Container, LinearProgress, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerProfileCard from "../components/card/BuyerProfileCard";
import UserProfileCard from "../components/card/UserProfileCard";
import VendorProfileCard from "../components/card/VendorProfileCard";
import CustomTabs from "../components/custom/CustomTabs";
import { displayError } from "../errors/displayError";
import { Buyer } from "../models/users/buyer";
import { User } from "../models/users/user";
import { Vendor } from "../models/users/vendor";
import { getBuyer } from "../network/users/buyers_api";
import { getVendor } from "../network/users/vendors_api";
import { ErrorPageText, LargeBodyText, centerText } from "../styles/TextSX";
import { SnackbarContext, UserContext, snackBarColor } from "../utils/contexts";

/** UI for the profiles page, depending on user's login status. */
const ProfilesPage = () => {
  // Create a navigate object to move between pages
  const navigate = useNavigate();
  // Retrieve the logged in user from the context
  const { user, setUser } = useContext(UserContext) || {};
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

  /** Function to update the user. */
  function updateUser(user: User) {
    setUser!(user);
  }

  /** Function to update the snackbar. */
  function updateSnackbar(text: string, color: snackBarColor, visible: boolean) {
    setSnackbar!({ text, color, visible });
  }

  /** UI layout for the content to be displayed in the buyer tab. */
  const BuyerTab = buyer ? (
    <BuyerProfileCard buyer={buyer} onBuyerUpdate={setBuyer} updateSnackbar={updateSnackbar} />
  ) : (
    <Stack direction="column" alignContent="center" gap={2}>
      <LargeBodyText sx={centerText}>
        You currently do not have a buyer profile.
      </LargeBodyText>
      <Button
        color="primary"
        variant="soft"
        onClick={() => {
          navigate("/profiles/create?role=buyer");
        }}
        sx={{ maxWidth: "50%", m: "auto" }}
      >
        Click here to create one
      </Button>
    </Stack>
  );

  /** UI layout for the content to be displayed in the vendor tab. */
  const VendorTab = vendor ? (
    <VendorProfileCard vendor={vendor} onVendorUpdate={setVendor} updateSnackbar={updateSnackbar} />
  ) : (
    <Stack direction="column" alignContent="center" gap={2}>
      <LargeBodyText sx={centerText}>
        You currently do not have a vendor profile.
      </LargeBodyText>
      <Button
        color="primary"
        variant="soft"
        onClick={() => {
          navigate("/profiles/create?role=vendor");
        }}
        sx={{ maxWidth: "50%", m: "auto" }}
      >
        Click here to create one
      </Button>
    </Stack>
  );

  return (
    <>
      {/* Display for the indicator while vendors are loading. */}
      {isLoading && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for when the profiles fail to load. */}
      {showLoadingError && (
        <ErrorPageText id="ProfilesPage">Something went wrong. Please try again.</ErrorPageText>
      )}

      {/* Display each profile's information. */}
      {!isLoading && !showLoadingError && user && (
        <Container id="ProfilesPage" sx={{ py: 5 }}>
          {/* Tabs for the profile page. */}
          <CustomTabs
            tabs={[
              // Display the user profile card.
              {
                tab: "User",
                panel: user && (
                  <UserProfileCard
                    user={user}
                    updateUser={updateUser}
                    updateSnackbar={updateSnackbar}
                  />
                ),
              },
              // Display the buyer profile card.
              {
                tab: "Role: Buyer",
                panel: BuyerTab,
              },
              // Display the vendor profile card.
              {
                tab: "Role: Vendor",
                panel: VendorTab,
              },
            ]}
            sx={{ mb: "10px" }}
          />
        </Container>
      )}
    </>
  );
};

export default ProfilesPage;
