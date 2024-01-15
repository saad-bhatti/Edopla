/**************************************************************************************************
 * This file contains the UI for the create profile page.                                         *
 * This page is used to create a buyer or vendor profile page for the authenticated user.         *                                                                                *
 **************************************************************************************************/

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useContext } from "react";
import CustomTabs from "../components/custom/CustomTabs";
import SideImageSection from "../components/section/auth/SideImageSection";
import CreateBuyerSection from "../components/section/profile/CreateBuyerSection";
import CreateVendorSection from "../components/section/profile/CreateVendorSection";
import { simpleSx } from "../styles/PageSX";
import { SubSectionTitleText } from "../styles/TextSX";
import { minPageHeight } from "../styles/StylingConstants";
import * as Context from "../utils/contexts";

/** UI for the create profile page. */
const CreateProfilePage = () => {
  // Retrieve the set logged in user function from the context
  const { user, setUser } = useContext(Context.UserContext) || {};
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

  /** UI layout for the side image section. */
  const ImageSection = <SideImageSection />;

  /** Sx for the log in page. */
  const customSx: SxProps = {
    ...simpleSx,
    maxHeight: minPageHeight,
  };

  /** UI layout for the create buyer profile. */
  const CreateBuyer = <CreateBuyerSection setUser={setUser!} updateSnackbar={updateSnackbar} />;

  /** UI layout for the create buyer section. */
  const BuyerSection = (
    <Stack direction="row" spacing={1} sx={customSx}>
      {ImageSection} {CreateBuyer}
    </Stack>
  );

  /** UI layout for the create vendor profile. */
  const CreateVendor = <CreateVendorSection setUser={setUser!} updateSnackbar={updateSnackbar} />;

  /** UI layout for the create vendor section. */
  const VendorSection = (
    <Stack direction="row" spacing={1} sx={customSx}>
      {CreateVendor} {ImageSection}
    </Stack>
  );

  return (
    <Stack id="CreateProfilePage" direction="column" spacing={1} sx={customSx}>
      <SubSectionTitleText children="Create a Profile for your Preferred Role" />
      <CustomTabs
        tabs={[
          // Display the create buyer section.
          {
            tab: "Role: Buyer",
            panel: !user!._buyer ? BuyerSection : null,
          },
          // Display the vendor profile card.
          {
            tab: "Role: Vendor",
            panel: !user!._vendor ? VendorSection : null,
          },
        ]}
        sx={{ marginBottom: "10px" }}
      />
    </Stack>
  );
};

export default CreateProfilePage;
