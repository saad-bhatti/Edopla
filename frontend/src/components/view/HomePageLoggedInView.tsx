import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Buyer } from "../../models/users/buyer";
import { getBuyer } from "../../network/users/buyers_api";

/* TODO: Finish up the logged in version of the home page. */
const HomePageLoggedInView = () => {
  /** State to track whether the user's profiles are being loaded. */
  const [profilesLoading, setProfilesLoading] = useState(true);
  /** State to show an error message if the profiles fail to load. */
  const [showProfilesLoadingError, setShowProfilesLoadingError] = useState(false);
  /** State to contain the buyer profile retrieved from the backend. */
  const [buyer, setBuyer] = useState<Buyer | null>(null);

  /** Retrieve the profiles only once before rendering the page. */
  useEffect(() => {
    async function loadProfiles() {
      try {
        setShowProfilesLoadingError(false);
        setProfilesLoading(true); // Show the loading indicator
        const buyer = await getBuyer();
        setBuyer(buyer);
      } catch (error) {
        console.error(error);
        setShowProfilesLoadingError(true); // Show the loading error
      } finally {
        setProfilesLoading(false); // Hide the loading indicator
      }
    }
    loadProfiles();
  }, []);

  return (
    <>
      {/* Display for the indicator while profiles are loading. */}
      {profilesLoading && <Spinner animation="border" variant="primary " />}

      {/* Display for when the profiles fail to load. */}
      {showProfilesLoadingError && (
        <p>The user does not have a buyer profile. Please create one.</p>
      )}

      {/* Display the buyer's information. */}
      {!profilesLoading && !showProfilesLoadingError && (
        <>
          <h1>Welcome to the Buyer's Home Page</h1>
          <p>
            <b>Name:</b> {buyer?.buyerName}
          </p>
          <p>
            <b>Address:</b> {buyer?.address}
          </p>
          <p>
            <b>Phone Number:</b> {buyer?.phoneNumber}
          </p>
        </>
      )}
    </>
  );
};

export default HomePageLoggedInView;
