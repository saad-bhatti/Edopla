/**************************************************************************************************
 * This file contains the UI for the sign up page.                                                *
 * This page is used to sign up to the website, either with an email and password or with a third *
 * party account.                                                                                 *
 **************************************************************************************************/

import { Stack } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";
import { useContext } from "react";
import SideImageSection from "../components/section/auth/SideImageSection";
import SignUpUserSection from "../components/section/auth/SignUpUserSection";
import { simpleSx } from "../styles/PageSX";
import { minPageHeight } from "../styles/StylingConstants";
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
  const UserSection = (
    <SignUpUserSection setUser={setUser!} setCarts={setCarts!} updateSnackbar={updateSnackbar} />
  );
  
  /** UI layout for the side image section. */
  const ImageSection = <SideImageSection />;

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
          {ImageSection} {UserSection}
        </>
      ) : (
        <>
          {UserSection} {ImageSection}
        </>
      )}
    </Stack>
  );
};

export default SignUpPage;
