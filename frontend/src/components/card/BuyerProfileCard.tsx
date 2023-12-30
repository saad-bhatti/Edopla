import { Buyer } from "../../models/users/buyer";
import { SxProps } from "@mui/joy/styles/types";
import CustomCard from "../custom/CustomCard";

/** Props of the buyer profile card component. */
interface BuyerProfileCardProps {
  buyer: Buyer;
  onEditBuyerClicked: () => void;
  sx?: SxProps;
}

/** UI component for a buyer profile card. */
const BuyerProfileCard = ({ buyer, onEditBuyerClicked, sx }: BuyerProfileCardProps) => {
  const { buyerName, address, phoneNumber } = buyer;

  /** UI layout for the card. */
  return <CustomCard cardContent={<div>Buyer Profile</div>} sx={sx} />;
};

export default BuyerProfileCard;
