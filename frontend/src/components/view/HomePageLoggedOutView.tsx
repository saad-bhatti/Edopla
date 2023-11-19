import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { Vendor } from "../../models/users/vendor";
import { getAllVendors } from "../../network/users/vendors_api";
import styles from "../../styles/pages/HomePage.module.css";
import VendorCard from "../card/VendorCard";
import VendorInfoModal from "../modal/VendorInfoModal";

/* TODO: Finish up the logged out version of the home page. */
const HomePageLoggedOutView = () => {
  // State to track whether the vendors are being loaded.
  const [vendorsLoading, setVendorsLoading] = useState(true);
  // State to show an error message if the vendors fail to load.
  const [showVendorsLoadingError, setShowVendorsLoadingError] = useState(false);
  // State to contain the vendors retrieved from the backend.
  const [vendors, setVendors] = useState<Vendor[]>([]);
  // State to track the vendor to whose further information will be shown
  const [vendorToView, setVendorToView] = useState<Vendor | null>(null);

  /** Retrieve the vendors only once before rendering the page. */
  useEffect(() => {
    async function loadVendors() {
      try {
        setShowVendorsLoadingError(false);
        setVendorsLoading(true); // Show the loading indicator
        const vendors = await getAllVendors();
        setVendors(vendors);
      } catch (error) {
        console.error(error);
        setShowVendorsLoadingError(true); // Show the loading error
      } finally {
        setVendorsLoading(false); // Hide the loading indicator
      }
    }
    loadVendors();
  }, []);

  /** Variable containing the display for all vendors. */
  const vendorsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
      {vendors.map((vendor, index) => (
        <Col key={vendor._id}>
          <VendorCard
            vendor={vendor}
            className={styles.vendor}
            onVendorClicked={setVendorToView}
            isInfoTheme={index % 2 === 0} // Alternate the theme of the card
          />
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {/* Display for the indicator while vendors are loading. */}
      {vendorsLoading && <Spinner animation="border" variant="primary " />}

      {/* Display for when the vendors fail to load. */}
      {showVendorsLoadingError && <p>Something went wrong. Please try again.</p>}

      {/* Display each vendor's card information. */}
      {!vendorsLoading && !showVendorsLoadingError && (
        <>
          {vendors!.length > 0 ? (
            vendorsGrid
          ) : (
            <p>No vendors available at the moment. Please try again later.</p>
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

export default HomePageLoggedOutView;
