import { LinearProgress, Stack, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import BuyerProfileCard from "../components/card/BuyerProfileCard";
import UserProfileCard from "../components/card/UserProfileCard";
import VendorProfileCard from "../components/card/VendorProfileCard";
import CustomTabs from "../components/custom/CustomTabs";
import BuyerProfileModal from "../components/modal/BuyerProfileModal";
import VendorProfileModal from "../components/modal/VendorProfileModal";
import { displayError } from "../errors/displayError";
import { Buyer } from "../models/users/buyer";
import { Vendor } from "../models/users/vendor";
import { getBuyer } from "../network/users/buyers_api";
import { getVendor } from "../network/users/vendors_api";
import { LoggedInUserContext, LoggedInUserContextProps } from "../utils/contexts";

/** UI for the profiles page, depending on user's login status. */
const ProfilesPage = () => {
  // Retrieve the logged in user from the context
  const { loggedInUser } = useContext<LoggedInUserContextProps | null>(LoggedInUserContext) || {};
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showLoadingError, setShowLoadingError] = useState(false);
  // State to track the user's buyer profile.
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  // State to control the display of the buyer profile modal.
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  // State to track the user's vendor profile.
  const [vendor, setVendor] = useState<Vendor | null>(null);
  // State to control the display of the vendor profile modal.
  const [showVendorModal, setShowVendorModal] = useState(false);

  /** Retrieve the buyer and vendor profiles only once before rendering the page. */
  useEffect(() => {
    async function loadProfiles() {
      try {
        if (loggedInUser) {
          setShowLoadingError(false);
          setIsLoading(true); // Show the loading indicator

          if (loggedInUser._buyer) {
            const buyer = await getBuyer();
            setBuyer(buyer);
          }

          if (loggedInUser._vendor) {
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
  }, [loggedInUser]);

  return (
    <>
      {/* Display for the indicator while vendors are loading. */}
      {isLoading && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for when the profiles fail to load. */}
      {showLoadingError && (
        <Stack alignItems="center">
          <Typography level="h3">Something went wrong. Please try again.</Typography>
        </Stack>
      )}

      {/* Display if the user is not logged in. */}
      {!isLoading && !showLoadingError && !loggedInUser && (
        <Stack alignItems="center">
          <Typography level="h3">Please sign up or log in to see profile details.</Typography>
        </Stack>
      )}

      {/* Display each profile's information. */}
      {!isLoading && !showLoadingError && loggedInUser && (
        <>
          {/* Tabs for the profile page. */}
          <CustomTabs
            tabs={[
              // Display the user profile card.
              { tab: "User", panel: loggedInUser && <UserProfileCard user={loggedInUser} /> },
              // Display the buyer profile card.
              {
                tab: "Buyer",
                panel: buyer && <BuyerProfileCard buyer={buyer} onBuyerUpdate={setBuyer} />,
              },
              // Display the vendor profile card.
              {
                tab: "Vendor",
                panel: vendor && (
                  // Display the vendor profile card.
                  <VendorProfileCard
                    vendor={vendor}
                    onEditVendorClicked={() => setShowVendorModal(true)}
                  />
                ),
              },
            ]}
            sx={{ marginBottom: "10px" }}
          />

          {/* Edit the buyer profile modal. */}
          {showBuyerModal && (
            <BuyerProfileModal
              buyer={buyer}
              onSaveSuccessful={(buyer) => {
                setBuyer(buyer);
                setShowBuyerModal(false);
              }}
              onDismissed={() => setShowBuyerModal(false)}
            />
          )}

          {/* Edit the vendor profile modal. */}
          {showVendorModal && (
            <VendorProfileModal
              vendor={vendor}
              onSaveSuccessful={(vendor) => {
                setVendor(vendor);
                setShowVendorModal(false);
              }}
              onDismissed={() => setShowVendorModal(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProfilesPage;
