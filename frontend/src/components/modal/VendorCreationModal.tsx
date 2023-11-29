import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConflictError } from "../../errors/http_errors";
import { Vendor } from "../../models/users/vendor";
import { VendorDetails, createVendor } from "../../network/users/vendors_api";
import StyleUtils from "../../styles/utils.module.css";
import TextInputField from "../form/TextInputField";

/** "Type" for the props of the vendor creation dialog component. */
interface VendorModalProps {
  onCreateSuccessful: (vendor: Vendor) => void;
  onSkipClicked: () => void;
}

/** Vendor creation modal component. */
const VendorCreationModal = ({ onCreateSuccessful, onSkipClicked }: VendorModalProps) => {
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
    try {
      const newVendor = await createVendor(details);
      onCreateSuccessful(newVendor); // Passes the vendor back to the caller
    } catch (error) {
      if (error instanceof ConflictError) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }

  /** Function to validate the price range field. */
  const validatePriceRange = (value: string) => {
    // Add your custom validation logic here
    return ["$", "$$", "$$$"].includes(value) || "Invalid price range";
  };

  /** UI layout for the vendor creation modal. */
  return (
    <Modal show>
      <Modal.Header style={{ display: "flex", flexDirection: "column" }}>
        <Modal.Title>Create a Vendor Profile</Modal.Title>
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
            register={register}
            error={errors.phoneNumber}
          />

          {/* Dialog for the register button */}
          <Button type="submit" disabled={isSubmitting} className={StyleUtils.width100}>
            Create Vendor Profile
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <p style={{ position: "absolute", left: "50%" }}>3/3</p>
        <Button variant="primary" style={{ marginLeft: "auto" }} onClick={onSkipClicked}>
          Skip
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VendorCreationModal;
