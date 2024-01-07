/**************************************************************************************************
 * This file contains the UI for the sign up page.                                                *
 * This page is used to sign up to the website, either with an email and password or with a third *
 * party account.                                                                                 *
 **************************************************************************************************/

import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Container, Stack } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useState } from "react";
import CustomSnackbar from "../../components/custom/CustomSnackbar";
import CustomStepper from "../../components/custom/CustomStepper";
import * as Context from "../../utils/contexts";
import CreateBuyerSection from "./CreateBuyerSection";
import CreateVendorSection from "./CreateVendorSection";
import SignUpSection from "./SignUpSection";

/** Props for the sign up page. */
interface SignUpPageProps {
  style: React.CSSProperties;
  sx: SxProps;
}

/** UI for the sign up page. */
const SignUpPage = ({ style, sx }: SignUpPageProps) => {
  // Get the current color scheme and the function to change it
  const { colorScheme } = useColorScheme();

  // Retrieve the set logged in user function from the context
  const { setLoggedInUser } =
    useContext<Context.LoggedInUserContextProps | null>(Context.LoggedInUserContext) || {};
  // Retrieve the set cart function from the context
  const { setCarts } = useContext<Context.CartsContextProps | null>(Context.CartsContext) || {};
  // State to control the current step of the sign up process.
  const [currentStep, setCurrentStep] = useState<number>(0);
  // State to control the display of the snackbar.
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // State to track the text and color of the snackbar.
  type possibleColors = "primary" | "neutral" | "danger" | "success" | "warning";
  const [snackbarFormat, setSnackbarFormat] = useState<{
    text: string;
    color: possibleColors;
  }>({
    text: "",
    color: "primary",
  });

  /** UI layout for the custom stepper. */
  const customStepper = (
    <CustomStepper
      labels={["User Profile", "Buyer Profile", "Vendor Profile"]}
      currentStep={currentStep}
      sx={{
        minWidth: "50vw",
        minHeight: "12vh",
        outline: "0.5px solid #E0E0E0",
        borderRadius: "6px",
        padding: "1% 0%",
      }}
    />
  );

  /** UI layout for the sign up section. */
  const signUpSection = (
    <SignUpSection
      setLoggedInUser={setLoggedInUser!}
      setCarts={setCarts!}
      setStep={setCurrentStep}
      setSnackbarFormat={setSnackbarFormat}
      setSnackbarVisible={setSnackbarVisible}
    />
  );

  /** UI layout for the buyer profile section. */
  const createBuyerSection = (
    <CreateBuyerSection
      setLoggedInUser={setLoggedInUser!}
      setStep={setCurrentStep}
      setSnackbarFormat={setSnackbarFormat}
      setSnackbarVisible={setSnackbarVisible}
    />
  );

  /** UI layout for the vendor profile section. */
  const createVendorSection = (
    <CreateVendorSection
      setLoggedInUser={setLoggedInUser!}
      setSnackbarFormat={setSnackbarFormat}
      setSnackbarVisible={setSnackbarVisible}
    />
  );

  /** UI layout for the all sections container. */
  const sectionContainer = (
    <Stack id="SignUpPageSection" direction="column" spacing={1}>
      {/* Custom stepper. */}
      {customStepper}

      {/* Sign up section. */}
      {currentStep === 0 && signUpSection}

      {/* Buyer profile section. */}
      {currentStep === 1 && createBuyerSection}

      {/* Vendor profile section. */}
      {currentStep === 2 && createVendorSection}
    </Stack>
  );

  /** UI layout for the side image. */
  const sideImage = (
    <Container
      sx={(theme) => ({
        [theme.getColorSchemeSelector("light")]: {
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
        },

        [theme.getColorSchemeSelector("dark")]: {
          backgroundImage:
            "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
        },
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "6px",
      })}
    />
  );

  /** UI layout for the snackbar. */
  const snackbar = (
    <CustomSnackbar
      content={snackbarFormat.text}
      color={snackbarFormat.color}
      open={snackbarVisible}
      onClose={() => {
        setSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** UI layout for the sign up page. */
  return (
    <Stack id="SignUpPage" direction="row" spacing={1} style={style} sx={sx}>
      {/* Snackbar. */}
      {snackbar}

      {/* Sections and side image. */}
      {colorScheme === "light" ? (
        <>
          {sideImage} {sectionContainer}
        </>
      ) : (
        <>
          {sectionContainer} {sideImage}
        </>
      )}
    </Stack>
  );
};

export default SignUpPage;
