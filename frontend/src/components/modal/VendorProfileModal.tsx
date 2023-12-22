import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { displayError } from "../../errors/displayError";
import { ConflictError } from "../../errors/http_errors";
import { Vendor } from "../../models/users/vendor";
import { VendorDetails, createVendor, updateVendor } from "../../network/users/vendors_api";
import StyleUtils from "../../styles/utils.module.css";
import TextInputField from "../form/TextInputField";

/** "Type" for the props of the vendor creation dialog component. */
interface VendorModalProps {
  vendor: Vendor | null;
  onSaveSuccessful: (vendor: Vendor) => void;
  onDismissed: () => void;
}

/** Vendor profile modal component. */
const VendorProfileModal = ({ vendor, onSaveSuccessful, onDismissed }: VendorModalProps) => {
  /** State to track the error text. */
  const [errorText, setErrorText] = useState<string | null>(null);

  /** React hook form to manage the form state. */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorDetails>();

  /** Function to handle the form submission. */
  async function onSubmit(details: VendorDetails) {
    let savedVendor;
    try {
      if (!vendor) savedVendor = await createVendor(details); // Creating a new vendor
      else savedVendor = await updateVendor(details); // Updating an existing vendor
      onSaveSuccessful(savedVendor); // Passes the vendor back to the caller
    } catch (error) {
      if (error instanceof ConflictError) setErrorText(error.message);
      else alert(error);
      displayError(error);
    }
  }

  /** Function to validate the price range field. */
  const validatePriceRange = (value: string) => {
    // Add your custom validation logic here
    return ["$", "$$", "$$$"].includes(value) || "Invalid price range";
  };

  /** UI layout for the vendor creation modal. */
  return (
    <Modal show onHide={onDismissed}>
      <Modal.Header style={{ display: "flex", flexDirection: "column" }}>
        <Modal.Title>{!vendor ? "Create a Vendor Profile" : "Update Vendor Profile"}</Modal.Title>
        <p style={{ marginBottom: "0px" }}>
          With a vendor profile, you can sell to others and more!
        </p>
      </Modal.Header>

      <Modal.Body>
        {/* Display the error text if there is any */}
        {errorText && <Alert variant="danger">{errorText}</Alert>}

        {/* Buyer creation form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog for the name field */}
          <TextInputField
            name="vendorName"
            label="Name *"
            type="text"
            placeholder="Enter your name"
            value={vendor?.vendorName || ""}
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.vendorName}
          />

          {/* Dialog for the address field */}
          <TextInputField
            name="address"
            label="Address *"
            type="address"
            placeholder="Enter your address"
            value={vendor?.address || ""}
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.address}
          />

          {/* Dialog for the price range field */}
          <TextInputField
            name="priceRange"
            label="Price Range *"
            type="text"
            placeholder="Enter your price range (Either $, $$, or $$$)"
            value={vendor?.priceRange || ""}
            register={register}
            registerOptions={{
              required: "Required",
              validate: validatePriceRange,
            }}
            error={errors.priceRange}
          />

          {/* Dialog for the phone number field */}
          <TextInputField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={vendor?.phoneNumber || ""}
            register={register}
            error={errors.phoneNumber}
          />

          {/* Dialog for the description field */}
          <TextInputField
            name="description"
            label="Description"
            as="textarea"
            rows={5}
            placeholder="Enter description"
            value={vendor?.description || ""}
            register={register}
            error={errors.phoneNumber}
          />

          {/* Dialog for the register button */}
          <Button type="submit" disabled={isSubmitting} className={StyleUtils.width100}>
            {!vendor ? "Create Vendor Profile" : "Update Vendor Profile"}
          </Button>
        </Form>
      </Modal.Body>

      {!vendor && (
        <Modal.Footer>
          <p style={{ position: "absolute", left: "50%" }}>3/3</p>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default VendorProfileModal;
