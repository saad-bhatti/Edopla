/**************************************************************************************************
 * This file contains the UI and functionality of authentication using google.                    *
 **************************************************************************************************/

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

/** Props of the google button. */
interface GoogleButtonProps {
  mode: "signin_with" | "signup_with" | "continue_with" | "signin" | undefined
  onSuccess: (jwtToken: string) => void;
  onError: () => void;
}

/** Google button to log in or sign up using google. */
const GoogleButton = ({ mode, onSuccess, onError }: GoogleButtonProps) => {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse: CredentialResponse) => {
        const jwtToken: string = credentialResponse.credential!;
        onSuccess(jwtToken);
      }}
      onError={onError}
      cancel_on_tap_outside
      text={mode}
      theme="outline"
      size="large"
      shape="rectangular"
      logo_alignment="left"
    />
  );
};

export default GoogleButton;
