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
import CustomCard from "../custom/CustomCard";
import CustomInput from "../custom/CustomInput";
import CustomSnackbar from "../custom/CustomSnackbar";
import {
  calculateDescriptivePasswordStrength,
  calculateNumericalPasswordStrength,
} from "../../utils/passwordStrength";

/** Props of the user profile card component. */
interface UserProfileCardProps {
  user: User;
  sx?: SxProps;
}

/** UI component for a user profile card. */
const UserProfileCard = ({ user, sx }: UserProfileCardProps) => {
  // Retrieve the email from the User object
  const { email } = user;
  // State to track the new email input value.
  const [newEmail, setNewEmail] = useState<string>(email);
  // State to control the display of the snackbar.
  const [emailSnackbarVisible, setEmailSnackbarVisible] = useState<boolean>(false);
  // State to control errors on the email form.
  const [emailError] = useState<{ isError: boolean; error: string }>({
    isError: false,
    error: "",
  });

  // State to track the current password input value.
  const [currentPassword, setCurrentPassword] = useState<string>("");
  // State to track the new password input value.
  const [newPassword, setNewPassword] = useState<string>("");
  // State to track the confirm password input value.
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // State to control the display of the snackbar.
  const [passwordSnackbarVisible, setPasswordSnackbarVisible] = useState<boolean>(false);
  // State to control errors on the password form.
  const [passwordError, setPasswordError] = useState<{ isError: number; error: string }>({
    isError: 0,
    error: "",
  });

  /** Function to handle an email change request. */
  function handleEmailChange(): void {
    // TODO: Send request to change email to backend

    // Upon success, display the email snackbar
    setEmailSnackbarVisible(true);

    // Reset the email field
    setNewEmail(email);
  }

  /** UI layout for the change email form. */
  const changeEmailForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleEmailChange();
      }}
    >
      <Stack spacing={1} direction="column" marginBottom={1}>
        {/* Email error text. */}
        {emailError.isError && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {emailError.error}
            </FormHelperText>
          </FormControl>
        )}

        {/* Email section title. */}
        <FormLabel>Email</FormLabel>

        {/* Email input. */}
        <FormControl error={emailError.isError}>
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

  /** UI layout for the email snackbar. */
  const emailSnackbar = (
    <CustomSnackbar
      content="This feature is coming soon! Thank you for your patience."
      color="primary"
      open={emailSnackbarVisible}
      onClose={() => {
        setEmailSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** Function to handle a password change request. */
  function handlePasswordChange(): void {
    // Validate the password
    if (calculateNumericalPasswordStrength(newPassword) < 3) {
      setPasswordError({
        isError: 2,
        error: "The new password does not meet the requirements",
      });
      return;
    }

    // Match the new password and confirm password
    if (newPassword !== confirmPassword) {
      setPasswordError({ isError: 3, error: "Passwords do not match" });
      return;
    }

    // TODO: Conditions met, send request to backend

    // Upon success, display the password snackbar
    setPasswordSnackbarVisible(true);

    // Reset the password fields and error state
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError({ isError: 0, error: "" });
  }

  /** UI layout for the change password form. */
  const changePasswordForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handlePasswordChange();
      }}
    >
      <Stack spacing={2} direction="column" marginBottom={2}>
        {/* Password error text. */}
        {passwordError.isError !== 0 && (
          <FormControl error>
            <FormHelperText>
              <InfoOutlined fontSize="small" />
              {passwordError.error}
            </FormHelperText>
          </FormControl>
        )}

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
            error={passwordError.isError === 1}
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
              error={passwordError.isError === 2}
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
              error={passwordError.isError === 3}
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

  /** UI layout for the password snackbar. */
  const passwordSnackbar = (
    <CustomSnackbar
      content="This feature is coming soon! Thank you for your patience."
      color="primary"
      open={passwordSnackbarVisible}
      onClose={() => {
        setPasswordSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** UI layout for the user profile card. */
  const cardContent = (
    <CardContent>
      <Stack
        spacing={2}
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ maxWidth: "51%" }}
      >
        {/* Change email form. */}
        {changeEmailForm}

        {/* Divider. */}
        <Divider sx={{ border: "1px solid #000" }} />

        {/* Change password section title. */}
        <Typography level="title-lg">Change Password</Typography>

        {/* Change password form. */}
        {changePasswordForm}
      </Stack>
    </CardContent>
  );

  /** UI layout for the card. */
  return (
    <>
      {/* Display the email snackbar. */}
      {emailSnackbar}
      {/* Display the password snackbar. */}
      {passwordSnackbar}
      {/* Display the user profile card. */}
      <CustomCard cardContent={cardContent} sx={sx} />
    </>
  );
};

export default UserProfileCard;
