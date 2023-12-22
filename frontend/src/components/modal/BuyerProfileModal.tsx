import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { displayError } from "../../errors/displayError";
import { ConflictError } from "../../errors/http_errors";
import { Buyer } from "../../models/users/buyer";
import { BuyerDetails, createBuyer, updateBuyer } from "../../network/users/buyers_api";
import StyleUtils from "../../styles/utils.module.css";
import TextInputField from "../form/TextInputField";

/** "Type" for the props of the buyer profile dialog component. */
interface BuyerModalProps {
  buyer: Buyer | null;
  onSaveSuccessful: (buyer: Buyer) => void;
  onDismissed: () => void;
}

/** Buyer profile modal component. */
const BuyerProfileModal = ({ buyer, onSaveSuccessful, onDismissed }: BuyerModalProps) => {
  /** State to track the error text. */
  const [errorText, setErrorText] = useState<string | null>(null);

  /** React hook form to manage the form state. */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BuyerDetails>();

  /** Function to handle the form submission. */
  async function onSubmit(details: BuyerDetails) {
    let savedBuyer;
    try {
      if (!buyer) savedBuyer = await createBuyer(details); // Creating a new buyer
      else savedBuyer = await updateBuyer(details); // Updating an existing buyer
      onSaveSuccessful(savedBuyer); // Passes the buyer back to the caller
    } catch (error) {
      if (error instanceof ConflictError) setErrorText(error.message);
      else alert(error);
      displayError(error);
    }
  }

  /** UI layout for the buyer creation modal. */
  return (
    <Modal show onHide={onDismissed}>
      <Modal.Header style={{ display: "flex", flexDirection: "column" }}>
        <Modal.Title>{!buyer ? "Create Buyer Profile" : "Update Buyer Profile"}</Modal.Title>
        <p style={{ marginBottom: "0px" }}>With a buyer profile, you can place orders and more!</p>
      </Modal.Header>

      <Modal.Body>
        {/* Display the error text if there is any */}
        {errorText && <Alert variant="danger">{errorText}</Alert>}

        {/* Buyer profile form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog for the name field */}
          <TextInputField
            name="buyerName"
            label="Name *"
            type="text"
            placeholder="Enter your name"
            value={buyer?.buyerName || ""}
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.buyerName}
          />

          {/* Dialog for the address field */}
          <TextInputField
            name="address"
            label="Address *"
            type="address"
            placeholder="Enter your address"
            value={buyer?.address || ""}
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.address}
          />

          {/* Dialog for the phone number field */}
          <TextInputField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={buyer?.phoneNumber || ""}
            register={register}
            error={errors.phoneNumber}
          />

          {/* Dialog for the register button */}
          <Button type="submit" disabled={isSubmitting} className={StyleUtils.width100}>
            {!buyer ? "Create Buyer Profile" : "Update Buyer Profile"}
          </Button>
        </Form>
      </Modal.Body>

      {!buyer && (
        <Modal.Footer>
          <p style={{ position: "absolute", left: "50%" }}>2/3</p>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default BuyerProfileModal;
