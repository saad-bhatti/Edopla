import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ConflictError } from "../../errors/http_errors";
import { User } from "../../models/users/user";
import { UserCredentials, signUp } from "../../network/users/users_api";
import StyleUtils from "../../styles/utils.module.css";
import TextInputField from "../form/TextInputField";

/** "Type" for the props of the Sign up dialog component. */
interface SignUpModalProps {
  onDismissed: () => void;
  onSignUpSuccessful: (user: User) => void;
}

/** Sign up dialog component. */
const SignUpModal = ({ onDismissed, onSignUpSuccessful }: SignUpModalProps) => {
  /** State to track the error text. */
  const [errorText, setErrorText] = useState<string | null>(null);

  /** React hook form to manage the form state. */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCredentials>();

  /** Function to handle the form submission. */
  async function onSubmit(credentials: UserCredentials) {
    try {
      const newUser = await signUp(credentials);
      onSignUpSuccessful(newUser); // Passes the user back to the caller
    } catch (error) {
      if (error instanceof ConflictError) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }

  /** UI layout for the sign up dialog. */
  return (
    <Modal show onHide={onDismissed}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Display the error text if there is any */}
        {errorText && <Alert variant="danger">{errorText}</Alert>}

        {/* Sign up form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog for the email field */}
          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
          />

          {/* Dialog for the password field */}
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />

          {/* Dialog for the register button */}
          <Button type="submit" disabled={isSubmitting} className={StyleUtils.width100}>
            Sign Up
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer className={StyleUtils.blockCenter}>
        <p>1/3</p>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;
