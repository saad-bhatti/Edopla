import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConflictError } from "../../errors/http_errors";
import { Buyer } from "../../models/users/buyer";
import { BuyerDetails, createBuyer } from "../../network/users/buyers_api";
import StyleUtils from "../../styles/utils.module.css";
import TextInputField from "../form/TextInputField";

/** "Type" for the props of the buyer creation dialog component. */
interface BuyerModalProps {
  onCreateSuccessful: (buyer: Buyer) => void;
  onSkipClicked: () => void;
}

/** Buyer creation modal component. */
const BuyerCreationModal = ({ onCreateSuccessful, onSkipClicked }: BuyerModalProps) => {
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
    try {
      const newBuyer = await createBuyer(details);
      onCreateSuccessful(newBuyer); // Passes the buyer back to the caller
    } catch (error) {
      if (error instanceof ConflictError) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }

  /** UI layout for the buyer creation modal. */
  return (
    <Modal show>
      <Modal.Header style={{ display: "flex", flexDirection: "column" }}>
        <Modal.Title>Create a Buyer Profile</Modal.Title>
        <p style={{ marginBottom: "0px" }}>With a buyer profile, you can place orders and more!</p>
      </Modal.Header>

      <Modal.Body>
        {/* Display the error text if there is any */}
        {errorText && <Alert variant="danger">{errorText}</Alert>}

        {/* Buyer creation form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog for the name field */}
          <TextInputField
            name="buyerName"
            label="Name *"
            type="text"
            placeholder="Enter your name"
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
            register={register}
            error={errors.phoneNumber}
          />

          {/* Dialog for the register button */}
          <Button type="submit" disabled={isSubmitting} className={StyleUtils.width100}>
            Create Buyer Profile
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <p style={{ position: "absolute", left: "50%" }}>2/3</p>
        <Button variant="primary" style={{ marginLeft: "auto" }} onClick={onSkipClicked}>
          Skip
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuyerCreationModal;
