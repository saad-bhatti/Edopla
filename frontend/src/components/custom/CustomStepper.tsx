import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Step, { stepClasses } from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import Stepper from "@mui/joy/Stepper";
import Typography from "@mui/joy/Typography";
import { SxProps } from "@mui/joy/styles/types";

/** Inspiration: https://mui.com/joy-ui/react-stepper/#system-CompanyRegistrationStepper.tsx */

/** Props of the custom stepper component. */
interface CustomStepperProps {
  labels: string[];
  currentStep: number;
  sx?: SxProps;
}

/** UI component for a custom stepper component. */
const CustomStepper = ({ labels, currentStep, sx }: CustomStepperProps) => {
  const customSX: SxProps = {
    width: "100%",
    [`& .${stepClasses.root}`]: {
      flexDirection: "column-reverse",
      "&:after": {
        top: "unset",
        bottom: "calc(var(--StepIndicator-size) / 2 - var(--Step-connectorThickness) / 2)",
      },
    },
    [`& .${stepClasses.completed}::after`]: {
      bgcolor: "primary.500",
    },
    [`& .${stepClasses.active} .${stepIndicatorClasses.root}`]: {
      borderColor: "primary.500",
    },
    [`& .${stepClasses.root}:has(+ .${stepClasses.active})::after`]: {
      color: "primary.500",
      backgroundColor: "transparent",
      backgroundImage: "radial-gradient(currentColor 2px, transparent 2px)",
      backgroundSize: "7px 7px",
      backgroundPosition: "center left",
    },
    [`& .${stepClasses.disabled} *`]: {
      color: "neutral.plainDisabledColor",
    },
    ...sx,
  };

  /** UI layout for the custom stepper component. */
  return (
    <Stepper sx={customSX}>
      {labels.map((label, index) => (
        <Step
          key={label}
          completed={index < currentStep}
          active={index === currentStep}
          disabled={index > currentStep}
          orientation="vertical"
          indicator={
            <StepIndicator
              variant={index < currentStep ? "solid" : "outlined"}
              color={index < currentStep ? "primary" : "neutral"}
            >
              {index < currentStep ? <CheckRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
            </StepIndicator>
          }
        >
          <Typography
            level="h4"
            fontWeight="xl"
            endDecorator={
              <Typography fontSize="sm" fontWeight="normal">
                {label}
              </Typography>
            }
          >
            {index + 1}
          </Typography>
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper;
