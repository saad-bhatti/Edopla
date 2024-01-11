/**************************************************************************************************
 * This file contains the UI for the user profile card.                                           *
 * The user profile card allows the user to change their email and password.                      *
 * The user profile card is displayed in the profiles page.                                       *
 **************************************************************************************************/

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
import { User } from "../../models/users/user";
import { snackBarColor } from "../../utils/contexts";
import {
  calculateDescriptivePasswordStrength,
  calculateNumericalPasswordStrength,
} from "../../utils/passwordStrength";
import CustomCard from "../custom/CustomCard";
import CustomInput from "../custom/CustomInput";

/** Props of the user profile card component. */
interface UserProfileCardProps {
  user: User;
  updateSnackbar: (text: string, color: snackBarColor, visible: boolean) => void;
  sx?: SxProps;
}

/** UI component for a user profile card. */
const UserProfileCard = ({ user, updateSnackbar, sx }: UserProfileCardProps) => {
  // Retrieve the email from the User object
  const { email } = user;
  // State to track the new email input value.
  const [newEmail, setNewEmail] = useState<string>(email);
  // State to track the current password input value.
  const [currentPassword, setCurrentPassword] = useState<string>("");
  // State to track the new password input value.
  const [newPassword, setNewPassword] = useState<string>("");
  // State to track the confirm password input value.
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  /** Function to handle an email change request. */
  function handleEmailChange(): void {
    // Upon success, display the email snackbar
    updateSnackbar("This feature is coming soon! Thank you for your patience.", "primary", true);

    // Reset the email field
    setNewEmail(email);
  }

  /** UI layout for the change email form. */
  const ChangeEmailForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleEmailChange();
      }}
    >
      <Stack spacing={1} direction="column" marginBottom={1}>
        {/* Email section title. */}
        <FormLabel>Email</FormLabel>

        {/* Email input. */}
        <FormControl>
          <CustomInput
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewEmail(event.target.value);
            }}
            startDecorator={<AccountCircleIcon />}
            required={true}
          />
        </FormControl>

        {/* Email helper text. */}
        <FormHelperText>Your email is not visible to any vendor or buyer.</FormHelperText>

        {/* Submit button. */}
        {newEmail !== email && (
          <Button
            type="submit"
            variant="solid"
            size="sm"
            sx={{ alignSelf: "flex-end" }}
            startDecorator={<SaveIcon fontSize="small" />}
          >
            Update Email
          </Button>
        )}
      </Stack>
    </form>
  );

  /** Function to handle a password change request. */
  function handlePasswordChange(): void {
    // Validate the password
    if (calculateNumericalPasswordStrength(newPassword) < 3) {
      updateSnackbar("The new password does not meet the requirements", "danger", true);
      return;
    }

    // Match the new password and confirm password
    if (newPassword !== confirmPassword) {
      updateSnackbar("Passwords do not match", "danger", true);
      return;
    }

    // Upon success, display the password snackbar
    updateSnackbar("This feature is coming soon! Thank you for your patience.", "primary", true);

    // Reset the password fields and error state
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  /** UI layout for the change password form. */
  const ChangePasswordForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handlePasswordChange();
      }}
    >
      <Stack spacing={2} direction="column" marginBottom={2}>
        {/* Current password input. */}
        <FormControl>
          <FormLabel>Current Password</FormLabel>
          <CustomInput
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCurrentPassword(event.target.value);
            }}
            startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
          />
        </FormControl>

        {/* New password section. */}
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Stack
            spacing={0.5}
            direction="column"
            sx={{
              "--hue": Math.min(calculateNumericalPasswordStrength(newPassword) * 40, 120),
            }}
          >
            {/* New password input. */}
            <CustomInput
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNewPassword(event.target.value);
              }}
              startDecorator={<Key fontSize="small" sx={{ alignSelf: "center" }} />}
            />
            {/* Password strength indicator. */}
            <LinearProgress
              determinate
              size="sm"
              value={Math.min((calculateNumericalPasswordStrength(newPassword) * 100) / 3, 100)}
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
              {calculateDescriptivePasswordStrength(newPassword)}
            </Typography>
          </Stack>
        </FormControl>

        {/* Confirm new password section. */}
        <FormControl>
          <Stack
            spacing={0.5}
            direction="column"
            sx={{ "--hue": Math.min(newPassword === confirmPassword ? 120 : 0, 120) }}
          >
            {/* Confirm password input. */}
            <CustomInput
              type="password"
              placeholder="Re-enter your new password"
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
                {newPassword !== confirmPassword ? "Passwords do not match" : "Passwords match"}
              </Typography>
            )}
          </Stack>
        </FormControl>

        {/* Password requirements. */}
        <FormControl>
          <FormHelperText>
            <InfoOutlined fontSize="small" />
            Password must be at least 8 characters long, contain at least one number, and one
            special character.
          </FormHelperText>
        </FormControl>
      </Stack>

      {/* Submit button. */}
      <FormControl>
        {newPassword && (
          <Button
            type="submit"
            variant="solid"
            size="sm"
            sx={{ alignSelf: "flex-end" }}
            startDecorator={<SaveIcon fontSize="small" />}
          >
            Update Password
          </Button>
        )}
      </FormControl>
    </form>
  );

  /** UI layout for the user profile card. */
  const UserCardContent = (
    <CardContent>
      <Stack
        spacing={2}
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ maxWidth: "51%" }}
      >
        {/* Change email form. */}
        {ChangeEmailForm}

        {/* Divider. */}
        <Divider sx={{ border: "1px solid #000" }} />

        {/* Change password section title. */}
        <Typography level="title-lg">Change Password</Typography>

        {/* Change password form. */}
        {ChangePasswordForm}
      </Stack>
    </CardContent>
  );

  /** UI layout for the card. */
  return <CustomCard cardContent={UserCardContent} sx={sx} />;
};

export default UserProfileCard;
