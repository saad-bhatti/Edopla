/**************************************************************************************************
 * This file contains the UI for the user profile card.                                           *
 * The user profile card allows the user to change their email and password. Along with linking   *
 * their OAuth accounts.                                                                          *
 * The user profile card is displayed in the profiles page.                                       *
 **************************************************************************************************/

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Key from "@mui/icons-material/Key";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";
import { displayError } from "../../errors/displayError";
import { User } from "../../models/users/user";
import { linkAuthentication } from "../../network/users/users_api";
import { snackBarColor } from "../../utils/contexts";
import {
  calculateDescriptivePasswordStrength,
  calculateNumericalPasswordStrength,
} from "../../utils/passwordStrength";
import GoogleButton from "../GoogleButton";
import CustomCard from "../custom/CustomCard";
import CustomInput from "../custom/CustomInput";

/** Props of the user profile card component. */
interface UserProfileCardProps {
  user: User;
  updateUser: (user: User) => void;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
  sx?: SxProps;
}

/** UI component for a user profile card. */
const UserProfileCard = ({ user, updateUser, updateSnackbar, sx }: UserProfileCardProps) => {
  // Retrieve the identification from the User object
  const { identification } = user;
  const initialEmail = identification.email || "";
  // State to track the new email input value.
  const [email, setEmail] = useState<string>(initialEmail);
  // State to track the new password input value.
  const [password, setPassword] = useState<string>("");
  // State to track the confirm password input value.
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  /** Function to handle linking form authentication. */
  async function handleFormLinking(): Promise<void> {
    // Part 1: Validate the password
    if (calculateNumericalPasswordStrength(password) < 3) {
      updateSnackbar("The password does not meet the requirements", "danger", true);
      return;
    }

    // Part 2: Match the password and confirm password
    if (password !== confirmPassword) {
      updateSnackbar("Passwords do not match", "danger", true);
      return;
    }

    // Part 3: Link the form authentication
    try {
      // Send the request to the backend
      const requestDetails = {
        identifier: "form",
        email: email,
        password: password,
      };
      const updatedUser = await linkAuthentication(requestDetails);

      // Upon success, display the password snackbar
      updateSnackbar(
        "Email successfully linked!.",
        "success",
        true
      );

      // Update the user
      updateUser(updatedUser);
    } catch (error) {
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
      return;
    }
  }

  /** UI layout for the email section of the form. */
  const AddEmailSection = (
    <Stack id="AddEmailSection" spacing={1} direction="column">
      {/* Email section title. */}
      <FormLabel>Email</FormLabel>

      {/* Email input. */}
      <FormControl>
        <CustomInput
          type="email"
          placeholder={"Enter your email"}
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
          startDecorator={<AccountCircleIcon />}
          required={true}
        />
      </FormControl>
    </Stack>
  );

  /** UI layout for the password section of the form. */
  const AddPasswordSection = (
    <Stack id="AddPasswordSection" spacing={2} direction="column">
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
          {/* New password input. */}
          <CustomInput
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
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
    </Stack>
  );

  /** UI layout for the link form section. */
  const LinkFormSection = (
    <form
      id="LinkFormSection"
      onSubmit={(event) => {
        event.preventDefault();
        handleFormLinking();
      }}
      style={{ minWidth: "51%" }}
    >
      <Stack spacing={2} direction="column">
        {/* Link OAuth accounts section title. */}
        <FormLabel sx={{ fontSize: "large" }}>Add an Email & Password</FormLabel>

        <Stack spacing={2} direction="column" alignItems="flex-start">
          {/* Email section. */}
          {AddEmailSection}

          {/* Password section. */}
          {AddPasswordSection}
        </Stack>

        {/* Submit button. */}
        <FormControl>
          {email && password && confirmPassword && (
            <Stack justifyContent="flex-end">
              <Button
                type="submit"
                variant="solid"
                size="sm"
                startDecorator={<SaveIcon fontSize="small" />}
                sx={{ width: "fit-content", margin: "auto" }}
              >
                Link Email
              </Button>
            </Stack>
          )}
        </FormControl>
      </Stack>
    </form>
  );

  const ExistingLinkFormSection = (
    <Stack spacing={2} direction="column">
      {/* Existing form section title. */}
      <FormLabel sx={{ fontSize: "large" }}>Email</FormLabel>

      {/* Section to show existing email. */}
      <CustomInput
        type="email"
        placeholder={""}
        value={email}
        onChange={() => {}}
        startDecorator={<AccountCircleIcon />}
        required={true}
      />
    </Stack>
  );

  /** Function to handle linking google authentication. */
  async function handleGoogleLinking(jwtToken: string) {
    // Part 1: Link the google authentication
    try {
      // Send the request to the backend
      const requestDetails = {
        identifier: "google",
        token: jwtToken,
      };
      const updatedUser = await linkAuthentication(requestDetails);

      // Upon success, display the password snackbar
      updateSnackbar("Google account successfully linked!.", "success", true);

      // Update the user
      updateUser(updatedUser);
    } catch (error) {
      error instanceof Error ? updateSnackbar(error.message, "danger", true) : displayError(error);
      return;
    }
  }

  /** UI layout for the linking oauth accounts section. */
  const LinkOAuthSection = (
    <Stack id="LinkOauthSection" spacing={2} direction="column" minWidth="51%">
      {/* Link OAuth accounts section title. */}
      <FormLabel sx={{ fontSize: "large" }}>Link Accounts</FormLabel>

      <Stack spacing={4} direction="row">
        {/* Link github oauth. */}
        <Button
          variant="soft"
          color="primary"
          startDecorator={<GitHubIcon />}
          endDecorator={identification.gitHubId && <CheckIcon />}
          onClick={() => {
            if (!identification.gitHubId)
              window.location.href =
                "https://github.com/login/oauth/authorize?client_id=" +
                process.env.REACT_APP_GITHUB_CLIENT_ID;
          }}
        >
          {identification.gitHubId ? "GitHub Linked" : "Link GitHub"}
        </Button>

        {/* Link google oauth. */}
        {!identification.googleId ? (
          <GoogleButton mode={"continue_with"} onSuccess={handleGoogleLinking} onError={() => {}} />
        ) : (
          <Button
            variant="soft"
            color="primary"
            startDecorator={<GoogleIcon />}
            endDecorator={<CheckIcon />}
          >
            Google Linked
          </Button>
        )}
      </Stack>

      {/* Link OAuth accounts helper text. */}
      {/* Password requirements. */}
      <FormHelperText sx={{ fontSize: "small" }}>
        <InfoOutlined fontSize="small" />
        Linking these accounts will allow you to sign in with them.
      </FormHelperText>
    </Stack>
  );

  /** UI layout for the user profile card. */
  const UserCardContent = (
    <CardContent>
      <Stack spacing={2} direction="column" justifyContent="space-between" alignItems="flex-start">
        {/* Link form authentication section. */}
        {!identification.email ? LinkFormSection : ExistingLinkFormSection}

        {/* Divider. */}
        <Divider sx={{ border: "1px solid" }} />

        {/* Link OAuth accounts section. */}
        {LinkOAuthSection}
      </Stack>
    </CardContent>
  );

  /** UI layout for the card. */
  return <CustomCard cardContent={UserCardContent} sx={sx} />;
};

export default UserProfileCard;
