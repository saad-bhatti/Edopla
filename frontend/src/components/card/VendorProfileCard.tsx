import { Vendor } from "../../models/users/vendor";
import { SxProps } from "@mui/joy/styles/types";
import CustomCard from "../custom/CustomCard";

/** Props of the vendor profile card component. */
interface VendorProfileCardProps {
  vendor: Vendor;
  onEditVendorClicked: () => void;
  sx?: SxProps;
}

/** UI component for a vendor profile card. */
const VendorProfileCard = ({ vendor, onEditVendorClicked, sx }: VendorProfileCardProps) => {
  const { vendorName, address, phoneNumber, priceRange, description, cuisineTypes } = vendor;

  /** UI layout for the card. */
  return <CustomCard cardContent={<div>Vendor Profile</div>} sx={sx} />;
};

export default VendorProfileCard;
