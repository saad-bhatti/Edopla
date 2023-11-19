import { Button, Card, ListGroup } from "react-bootstrap";
import { Vendor as VendorModel } from "../../models/users/vendor";
import { Link } from "react-router-dom";

/** Props of the Vendor component. */
interface VendorProps {
  vendor: VendorModel;
  onVendorClicked: (vendor: VendorModel) => void;
  className?: string;
  isInfoTheme?: boolean;
}

/** UI component for a vendor. */
const Vendor = ({ vendor, onVendorClicked, className, isInfoTheme }: VendorProps) => {
  const { vendorName, description, priceRange, cuisineTypes } = vendor;

  /** UI layout for the vendor card. */
  return (
    <Card
      className={`mb-2 ${className}`}
      onClick={() => {
        onVendorClicked(vendor);
      }}
      border="dark"
      bg={isInfoTheme ? "info" : "light"}
      key={isInfoTheme ? "Info" : "Light"}
      text={isInfoTheme ? "white" : "dark"}
    >
      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div>
          {/* Vendor Name */}
          <Card.Title>{vendorName}</Card.Title>

          {/* Vendor Info */}
          <ListGroup variant="flush">
            <ListGroup.Item
              className={`bg-transparent ${isInfoTheme ? "text-light" : "text-dark"}`}
            >{`Description: ${description}`}</ListGroup.Item>
            <ListGroup.Item
              className={`bg-transparent ${isInfoTheme ? "text-light" : "text-dark"}`}
            >{`Price Range: ${priceRange}`}</ListGroup.Item>
            <ListGroup.Item
              className={`bg-transparent ${isInfoTheme ? "text-light" : "text-dark"}`}
            >{`Cuisine Types: ${cuisineTypes.toString()}`}</ListGroup.Item>
          </ListGroup>
        </div>

        {/* Button to directly order from the vendor */}
        <div style={{ alignSelf: "flex-end" }}>
          <Button
            variant={isInfoTheme ? "light" : "info"}
            // @ts-ignore
            as={Link as React.ElementType}
            to={`/vendor/${vendor._id}`}
            onClick={(event) => {
              event.stopPropagation();  // Prevent the vendor info modal from being opened
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
