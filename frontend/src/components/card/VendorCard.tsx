import { Button, Card, ListGroup } from "react-bootstrap";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Vendor as VendorModel } from "../../models/users/vendor";
import styles from "../../styles/components/VendorCard.module.css";

/** Props of the Vendor component. */
interface VendorProps {
  vendor: VendorModel;
  onVendorClicked: (vendor: VendorModel) => void;
  isSaved: boolean;
  onVendorSaved: (vendor: VendorModel) => void;
  className?: string;
  isInfoTheme?: boolean;
}

/** UI component for a vendor. */
const Vendor = ({
  vendor,
  onVendorClicked,
  isSaved,
  onVendorSaved,
  className,
  isInfoTheme,
}: VendorProps) => {
  const { vendorName, description, priceRange, cuisineTypes } = vendor;
  const cardClass = `${styles.vendorCard} ${
    isInfoTheme ? styles.vendorCardInfo : styles.vendorCardLight
  } ${className}`;
  const listItemClass = `${styles.listItem} ${
    isInfoTheme ? styles.listItemInfo : styles.listItemLight
  }`;

  /** UI layout for the vendor card. */
  return (
    <Card
      className={`mb-2 ${cardClass}`}
      onClick={() => {
        onVendorClicked(vendor);
      }}
    >
      <Card.Body className={styles.vendorCardBody}>
        <div>
          {/* Vendor Name */}
          <Card.Title>{vendorName}</Card.Title>

          {/* Vendor Info */}
          <ListGroup variant="flush">
            <ListGroup.Item
              className={listItemClass}
            >{`Description: ${description}`}</ListGroup.Item>
            <ListGroup.Item
              className={listItemClass}
            >{`Price Range: ${priceRange}`}</ListGroup.Item>
            <ListGroup.Item className={listItemClass}>{`Cuisine Types: ${cuisineTypes.join(
              ", "
            )}`}</ListGroup.Item>
          </ListGroup>
        </div>

        {/* Save button icon and Order button */}
        <div className={styles.bottomButtonsContainer}>
          {/* Save button icon. */}
          <>
            {isSaved ? (
              <FaBookmark
                className="text-muted"
                size={25}
                onClick={(event) => {
                  onVendorSaved(vendor);
                  event.stopPropagation(); // Prevent the vendor info modal from being opened
                }}
              />
            ) : (
              <FaRegBookmark
                className="text-muted"
                size={25}
                onClick={(event) => {
                  onVendorSaved(vendor);
                  event.stopPropagation(); // Prevent the vendor info modal from being opened
                }}
              />
            )}
          </>

          {/* Button to directly order from the vendor. */}
          <Button
            variant={isInfoTheme ? "light" : "info"}
            // @ts-ignore
            as={Link as React.ElementType}
            to={`/vendor/${vendor._id}`}
            onClick={(event) => {
              event.stopPropagation(); // Prevent the vendor info modal from being opened
            }}
          >
            Order from here
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Vendor;
