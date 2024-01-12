/**************************************************************************************************
 * This file contains the UI for the sign up page.                                                *
 * This page is used to sign up to the website, either with an email and password or with a third *
 * party account.                                                                                 *
 **************************************************************************************************/

import { Container, Stack } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useState } from "react";
import CreateBuyerSection from "../components/section/CreateBuyerSection";
import CreateUserSection from "../components/section/CreateUserSection";
import CreateVendorSection from "../components/section/CreateVendorSection";
import { simpleSx } from "../styles/PageSX";
import { minPageHeight } from "../styles/constants";
import * as Context from "../utils/contexts";

/** UI for the sign up page. */
const SignUpPage = () => {
  // Get the current color scheme and the function to change it
  const { colorScheme } = useColorScheme();
  // Retrieve the set logged in user function from the context
  const { setUser } = useContext(Context.UserContext) || {};
  // Retrieve the set cart function from the context
  const { setCarts } = useContext(Context.CartsContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Context.SnackbarContext) || {};
  // State to control the current step of the sign up process.
  const [currentStep, setCurrentStep] = useState<number>(0);
  // State to track whether the client is a buyer or a vendor.
  const [isBuyer, setIsBuyer] = useState<boolean>(true);

  /**
   * Function to set the snackbar format and its visibility.
   * @param text The text to display in the snackbar.
   * @param color The color of the snackbar.
   * @param visible Whether the snackbar is visible or not.
   */
  function updateSnackbar(text: string, color: Context.snackBarColor, visible: boolean): void {
    setSnackbar!({ text, color, visible });
  }

  /** UI layout for the sign up section. */
  const CreateUser = (
    <CreateUserSection
      setUser={setUser!}
      setIsBuyer={setIsBuyer}
      setCarts={setCarts!}
      setStep={setCurrentStep}
      updateSnackbar={updateSnackbar}
    />
  );

  /** UI layout for the buyer profile section. */
  const CreateBuyer = (
    <CreateBuyerSection setUser={setUser!} updateSnackbar={updateSnackbar} />
  );

  /** UI layout for the vendor profile section. */
  const CreateVendor = (
    <CreateVendorSection setUser={setUser!} updateSnackbar={updateSnackbar} />
  );

  /** UI layout for the all sections container. */
  const SectionContainer = (
    <Stack id="SignUpPageSection" direction="column" spacing={1}>
      {/* Sign up section. */}
      {currentStep === 0 && CreateUser}

      {/* Buyer profile section. */}
      {currentStep === 1 && isBuyer && CreateBuyer}

      {/* Vendor profile section. */}
      {currentStep === 1 && !isBuyer && CreateVendor}
    </Stack>
  );

  /** UI layout for the side image. */
  const SideImage = (
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

  /** Sx for the log in page. */
  const customSx: SxProps = {
    ...simpleSx,
    maxHeight: minPageHeight,
  };

  /** UI layout for the sign up page. */
  return (
    <Stack id="SignUpPage" direction="row" spacing={1} sx={customSx}>
      {/* Sections and side image. */}
      {colorScheme === "light" ? (
        <>
          {SideImage} {SectionContainer}
        </>
      ) : (
        <>
          {SectionContainer} {SideImage}
        </>
      )}
    </Stack>
  );
};

export default SignUpPage;
