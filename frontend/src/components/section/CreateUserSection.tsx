/**************************************************************************************************
 * This file contains the UI for the sign up section of the sign up page.                         *
 **************************************************************************************************/

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Key from "@mui/icons-material/Key";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { displayError } from "../../errors/displayError";
import { CartItem } from "../../models/items/cartItem";
import { User } from "../../models/users/user";
import { signUp, signUpGoogle } from "../../network/users/users_api";
import { snackBarColor } from "../../utils/contexts";
import {
  calculateDescriptivePasswordStrength,
  calculateNumericalPasswordStrength,
} from "../../utils/passwordStrength";
import GoogleButton from "../GoogleButton";
import CustomDropdown from "../custom/CustomDropdown";
import CustomInput from "../custom/CustomInput";

/** Props of the sign up section. */
interface SignUpSectionProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setIsBuyer: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
}

/** UI for the sign up section. */
const SignUpSection = ({
  setUser,
  setCarts,
  setIsBuyer,
  setStep,
  updateSnackbar,
}: SignUpSectionProps) => {
  // State to track the email input.
  const [email, setEmail] = useState<string>("");
  // State to track the password input.
  const [password, setPassword] = useState<string>("");
  // State to track the confirm password input.
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // State to control errors on the sign up information form.
  const [formError, setFormError] = useState<{ isError: number; error: string }>({
    isError: 0,
    error: "",
  });

  /** Function to validate the sign up form. */
  function validateFormSignUp() {
    // Validate the password
    if (calculateNumericalPasswordStrength(password) < 3) {
      setFormError({
        isError: 2,
        error: "The password does not meet the specified requirements",
      });
      return;
    }

    // Match the password and confirm password
    if (password !== confirmPassword) {
      setFormError({ isError: 3, error: "Passwords do not match" });
      return;
    }

    // Reset the form error state.
    setFormError({ isError: 0, error: "" });
  }

  /**
   * Function to handle sign up submission.
   * @param thirdPartyToken
   *    The third party token to sign up with.
   *    Empty string if the sign up is through the form.
   * @returns Nothing.
   */
  async function handleSignUp(thirdPartyToken: string): Promise<void> {
    // Validate the form if the sign up is through the form.
    if (!thirdPartyToken.length) validateFormSignUp();

    try {
      let newUser: User;
      // Sign up done using the sign up form.
      if (!thirdPartyToken.length) {
        const requestDetails = {
          email: email,
          password: password,
        };
        newUser = await signUp(requestDetails);
      }
      // Sign up done using third party sign up.
      else {
        const requestDetails = {
          token: thirdPartyToken,
        };
        newUser = await signUpGoogle(requestDetails);
      }
      // Set the logged in user.
      setUser!(newUser);

      // Initialize the user's cart.
      setCarts!([]);

      // Set the snackbar to display a success message.
      updateSnackbar("Successfully created your account!", "success", true);

      // Increment the step.
      setStep((prevStep) => prevStep + 1);
    } catch (error) {
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
    }
  }

  /** UI layout for the third party signup options. */
  const ThirdPartySignUp = (
    <Stack direction="row" gap={4} alignSelf="center" minWidth="43%">
      {/* Google log in button. */}
      <GoogleButton
        isLogIn={false}
        onSuccess={(jwtToken: string) => handleSignUp(jwtToken)}
        onError={() => {
          updateSnackbar(
            "An error occurred while signing up with Google. Please try again.",
            "danger",
            true
          );
        }}
      />

      {/* Facebook sign up button. */}
      <Button
        variant="soft"
        color="primary"
        startDecorator={<FacebookIcon />}
        onClick={() => {
          updateSnackbar(
            "This feature is coming soon! Thank you for your patience.",
            "primary",
            true
          );
        }}
      >
        Sign up with Facebook
      </Button>
    </Stack>
  );

  /** UI layout for the sign up form. */
  const SignUpForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSignUp("");
      }}
    >
      <Stack gap={3.5} direction="column" alignItems="center">
        {/* Form error text. */}
        {formError.isError !== 0 && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {formError.error}
            </FormHelperText>
          </FormControl>
        )}

        {/* Email section. */}
        <FormControl>
          <FormLabel>Email</FormLabel>
          {/* Email input. */}
          <CustomInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            startDecorator={<EmailIcon fontSize="small" />}
            required={true}
            error={formError.isError === 1}
          />
        </FormControl>

        {/* Password section. */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Stack
            spacing={0.5}
            direction="column"
            sx={{
              "--hue": Math.min(calculateNumericalPasswordStrength(password) * 40, 120),
            }}
          >
            {/* Password input. */}
            <CustomInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }}
              startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
              required={true}
              error={formError.isError === 2}
            />
            {/* Password strength indicator. */}
            <LinearProgress
              determinate
              size="sm"
              value={Math.min((calculateNumericalPasswordStrength(password) * 100) / 3, 100)}
              sx={{
                bgcolor: "background.level3",
                color: "hsl(var(--hue) 80% 40%)",
              }}
            />
            {/* Password strength text. */}
            <Typography
              level="body-xs"
              sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
            >
              {calculateDescriptivePasswordStrength(password)}
            </Typography>
          </Stack>
        </FormControl>

        {/* Confirm password section. */}
        <FormControl>
          <Stack
            spacing={0.5}
            direction="column"
            sx={{ "--hue": Math.min(password === confirmPassword ? 120 : 0, 120) }}
          >
            {/* Confirm password input. */}
            <CustomInput
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setConfirmPassword(event.target.value);
              }}
              startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
              required={true}
              error={formError.isError === 3}
            />

            {/* Password match text. */}
            {confirmPassword.length > 0 && (
              <Typography
                level="body-xs"
                sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
              >
                {password !== confirmPassword ? "Passwords do not match" : "Passwords match"}
              </Typography>
            )}
          </Stack>
        </FormControl>

        {/* Password requirements. */}
        <FormHelperText sx={{ fontSize: "small" }}>
          <InfoOutlined fontSize="small" />
          Password requirements: Minimum of 8 characters, a number, and a special character.
        </FormHelperText>

        {/* Role selection. */}
        <CustomDropdown
          label="I am a"
          options={["Buyer", "Vendor"]}
          onOptionClick={[() => setIsBuyer(true), null]}
          variant="soft"
          color="primary"
          sx={{ minWidth: "47%" }}
        />

        {/* Sign up button. */}
        <Button type="submit" variant="solid" color="primary" sx={{ minWidth: "47%" }}>
          Sign Up
        </Button>
      </Stack>
    </form>
  );

  /** UI layout for the sign up section. */
  return (
    <Stack
      id="SignUpSection"
      direction="column"
      alignItems="center"
      gap={2}
      sx={{
        minWidth: "50vw",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        padding: "1% 0%",
        minHeight: "75vh",
      }}
    >
      {/* Welcome message. */}
      <Typography level="title-lg">Welcome to Edopla!</Typography>

      {/* Third party sign up options. */}
      {ThirdPartySignUp}

      {/* Or separator. */}
      <Divider orientation="horizontal" sx={{ padding: "0% 10%" }}>
        or
      </Divider>

      {/* Sign up form. */}
      {SignUpForm}
    </Stack>
  );
};

export default SignUpSection;
