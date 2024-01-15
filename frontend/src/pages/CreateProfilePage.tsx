/**************************************************************************************************
 * This file contains the UI for the create profile page.                                         *
 * This page is used to create a buyer or vendor profile page for the authenticated user.         *                                                                                *
 **************************************************************************************************/

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useEffect, useState } from "react";
import CustomTabs from "../components/custom/CustomTabs";
import SideImageSection from "../components/section/auth/SideImageSection";
import CreateBuyerSection from "../components/section/profile/CreateBuyerSection";
import CreateVendorSection from "../components/section/profile/CreateVendorSection";
import { simpleSx } from "../styles/PageSX";
import { SubSectionTitleText } from "../styles/TextSX";
import * as Context from "../utils/contexts";

/** UI for the create profile page. */
const CreateProfilePage = () => {
  // Retrieve the set logged in user function from the context
  const { user, setUser } = useContext(Context.UserContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Context.SnackbarContext) || {};
  // State to track the tabs to display.
  const [tabs, setTabs] = useState<{ tab: string; panel: JSX.Element | null }[]>([]);

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

  /** Set the tabs to display based on the user's missing profiles. */
  useEffect(() => {
    // Add the buyer tab if the user is not a buyer.
    if (!user!._buyer)
      setTabs((existingTabs) => [...existingTabs, { tab: "Role: Buyer", panel: BuyerSection }]);

    // Add the vendor tab if the user is not a vendor.
    if (!user!._vendor)
      setTabs((existingTabs) => [...existingTabs, { tab: "Role: Vendor", panel: VendorSection }]);
    
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /** UI layout for the create profile page. */
  return (
    <Stack id="CreateProfilePage" direction="column" spacing={1} sx={customSx}>
      <SubSectionTitleText children="Create a Profile for your Preferred Role" />
      <CustomTabs tabs={tabs} sx={{ mb: "10px" }} />
    </Stack>
  );
};

export default CreateProfilePage;
