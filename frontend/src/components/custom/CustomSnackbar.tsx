import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/joy/Snackbar";
import { keyframes } from "@mui/system";

/** Props of the custom snackbar component. */
interface CustomSnackbarProps {
  content: string;
  color: "primary" | "neutral" | "danger" | "success" | "warning";
  open: boolean;
  onClose: () => void;
  startDecorator?: React.ReactNode;
}

/** UI component for a custom snackbar. */
const CustomSnackbar = ({ content, color, open, onClose, startDecorator }: CustomSnackbarProps) => {
  // Variables to control the animation of the snackbar.
  const animationDuration = 500;
  const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;
  const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

  /** UI layout for the custom snackbar. */
  return (
    <Snackbar
      variant="soft"
      color={color}
      size="sm"
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      startDecorator={startDecorator}
      endDecorator={<CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />}
      autoHideDuration={5000}
      animationDuration={animationDuration}
      sx={{
        ...(open && {
          animation: `${inAnimation} ${animationDuration}ms forwards`,
        }),
        ...(!open && {
          animation: `${outAnimation} ${animationDuration}ms forwards`,
        }),
      }}
    >
      {content}
    </Snackbar>
  );
};

export default CustomSnackbar;
