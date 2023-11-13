import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { UnauthorizedError } from "../errors/http_errors";
import { User } from "../models/users/user";
import { UserCredentials, logIn } from "../network/users/users_api";
import StyleUtils from "../styles/utils.module.css";
import TextInputField from "./form/TextInputField";

/** "Type" for the props of the log in dialog component. */
interface LoginModalProps {
  onDismissed: () => void;
  onLoginSuccessful: (user: User) => void;
}

/** Log in dialog component. */
const LoginModal = ({ onDismissed, onLoginSuccessful }: LoginModalProps) => {
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
      const authenticatedUser = await logIn(credentials);
      onLoginSuccessful(authenticatedUser); // Passes the user back to the caller
    } catch (error) {
      if (error instanceof UnauthorizedError) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }

  /** UI layout for the log in dialog. */
  return (
    <Modal show onHide={onDismissed}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Display the error text if there is any */}
        {errorText && <Alert variant="danger">{errorText}</Alert>}

        {/* Log in form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Dialog for the username field */}
          <TextInputField
            name="email"
            label="email"
            type="text"
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
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
