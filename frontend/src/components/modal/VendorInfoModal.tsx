import { Button, Modal } from "react-bootstrap";
import { Vendor as VendorModel } from "../../models/users/vendor";

/** Props of the vendor information modal component. */
interface VendorInfoModalProps {
  vendor: VendorModel;
  onDismissed: () => void;
}

/** Vendor information modal component. */
const VendorInfoModal = ({ vendor, onDismissed }: VendorInfoModalProps) => {
  const { vendorName, description, priceRange, cuisineTypes, address, phoneNumber } = vendor;

  /** UI layout for the log in dialog. */
  return (
    <Modal show centered onHide={onDismissed}>
      {/* Vendor Name */}
      <Modal.Header closeButton>
        <Modal.Title>{vendorName}</Modal.Title>
      </Modal.Header>

      {/* Vendor Info */}
      <Modal.Body>
        <p>{`Description: ${description}`}</p>
        <p>{`Address: ${address}`}</p>
        <p>{`Phone Number: ${phoneNumber}`}</p>
        <p>{`Price Range: ${priceRange}`}</p>
        <p>{`Cuisine Types: ${cuisineTypes.toString()}`}</p>
      </Modal.Body>

      {/* View Menu Button */}
      <Modal.Footer>
        <Button variant="primary">Order from here</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VendorInfoModal;
