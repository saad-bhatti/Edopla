import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import VendorCard from "../components/card/VendorCard";
import VendorInfoModal from "../components/modal/VendorInfoModal";
import { User } from "../models/users/user";
import { Vendor } from "../models/users/vendor";
import { getSavedVendors, toggleSavedVendor } from "../network/users/buyers_api";
import { getAllVendors } from "../network/users/vendors_api";
import styles from "../styles/pages/HomePage.module.css";

/** "Type" for the props of the home page. */
interface HomePageProps {
  loggedInUser: User | null;
}

/** UI for the home page, depending on user's login status. */
const NotesPage = ({ loggedInUser }: HomePageProps) => {
  // State to track whether the page data is being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showLoadingError, setShowLoadingError] = useState(false);
  // State to contain information of the saved vendors.
  const [savedVendors, setSavedVendors] = useState<Vendor[]>([]);
  // State to contain information of the unsaved vendors.
  const [unsavedVendors, setUnsavedVendors] = useState<Vendor[]>([]);
  // State to track the vendor to whose further information will be shown
  const [vendorToView, setVendorToView] = useState<Vendor | null>(null);

  /**
   * Function to handle toggling a vendor's saved status.
   * @param vendorToToggle The vendor to save or unsave.
   * @returns Nothing.
   */
  async function toggleVendor(vendorToToggle: Vendor) {
    try {
      if (!loggedInUser || !loggedInUser._buyer)
        throw new Error("You must create a buyer profile prior to saving a vendor.");

      const updatedSavedVendors = await toggleSavedVendor({ vendorId: vendorToToggle._id });
      const initialLength = savedVendors.length;
      const updatedLength = updatedSavedVendors.length;

      setSavedVendors(updatedSavedVendors);
      if (updatedLength > initialLength)
        setUnsavedVendors(unsavedVendors.filter((vendor) => vendor._id !== vendorToToggle._id));
      else setUnsavedVendors([...unsavedVendors, vendorToToggle]);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  /** Retrieve the vendors only once before rendering the page. */
  useEffect(() => {
    async function loadVendors() {
      try {
        setShowLoadingError(false);
        setIsLoading(true); // Show the loading indicator

        const allVendors = await getAllVendors(); // Retrieve all vendors

        let savedVendors: Vendor[] = []; // Retrieve saved vendors
        if (loggedInUser && loggedInUser._buyer) {
          savedVendors = await getSavedVendors();
          setSavedVendors(savedVendors);
        }

        // Set unsaved vendors
        setUnsavedVendors(
          allVendors.filter((vendor) => {
            return !savedVendors.includes(vendor);
          })
        );
      } catch (error) {
        console.error(error);
        setShowLoadingError(true); // Show the loading error
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
    loadVendors();
  }, [loggedInUser]);

  /** Variable containing the display for saved vendors. */
  const savedVendorsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.vendorsGrid}`}>
      {savedVendors.map((vendor: Vendor, index: number) => (
        <Col key={vendor._id}>
          <VendorCard
            vendor={vendor}
            onVendorClicked={setVendorToView}
            isSaved={true}
            onVendorToggled={toggleVendor}
            className={styles.vendor}
            isDarkTheme={index % 2 === 0} // Alternate the theme of the card
          />
        </Col>
      ))}
    </Row>
  );

  /** Variable containing the display for all vendors that are not in saved vendors. */
  const unsavedVendorsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.vendorsGrid}`}>
      {unsavedVendors.map((vendor: Vendor, index: number) =>
        // If the vendor is in within the saved vendors, then display nothing
        savedVendors.find((savedVendor: Vendor) => savedVendor._id === vendor._id) ? null : (
          // Otherwise, display the vendor card
          <Col key={vendor._id}>
            <VendorCard
              vendor={vendor}
              onVendorClicked={setVendorToView}
              isSaved={false}
              onVendorToggled={toggleVendor}
              className={styles.vendor}
              isDarkTheme={index % 2 === 0} // Alternate the theme of the card
            />
          </Col>
        )
      )}
    </Row>
  );

  /** UI layout for the home page. */
  return (
    <>
      {/* Display for the indicator while vendors are loading. */}
      {isLoading && <Spinner animation="border" variant="primary " />}

      {/* Display for when the vendors fail to load. */}
      {showLoadingError && <p>Something went wrong. Please try again.</p>}

      {/* Display each vendor's card information. */}
      {!isLoading && !showLoadingError && (
        <>
          {savedVendors!.length > 0 ? (
            <div>
              <h1>Saved Vendors</h1>
              {savedVendorsGrid}
            </div>
          ) : null}
          {unsavedVendors!.length > 0 ? (
            <div>
              <h1>All Vendors</h1>
              {unsavedVendorsGrid}
            </div>
          ) : (
            <>
              {savedVendors!.length > 0 ? null : (
                <p>No vendors available at the moment. Please try again later.</p>
              )}
            </>
          )}
        </>
      )}

      {/* See more vendor information modal */}
      {vendorToView && (
        <VendorInfoModal vendor={vendorToView} onDismissed={() => setVendorToView(null)} />
      )}
    </>
  );
};

export default NotesPage;
