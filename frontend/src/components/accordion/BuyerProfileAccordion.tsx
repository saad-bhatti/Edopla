import { Buyer as BuyerModel } from "../../models/users/buyer";
import CustomAccordion from "./CustomAccordion";

/** Props of the buyer profile accordion component. */
interface BuyerProfileProps {
  buyer: BuyerModel;
  onEditBuyerClicked: () => void;
  className?: string;
}

/** UI component for a buyer profile accordion. */
const BuyerProfileAccordion = ({ buyer, onEditBuyerClicked, className }: BuyerProfileProps) => {
  const { buyerName, address, phoneNumber } = buyer;

  /** UI layout for the accordion. */
  return (
    <CustomAccordion
      headerText="Buyer Profile"
      listGroupText={["Name", "Address", "Phone Number"]}
      listGroupValues={[buyerName, address, phoneNumber ?? ""]}
      buttonText="Edit"
      onButtonClicked={onEditBuyerClicked}
      className={className}
    />
  );
};

export default BuyerProfileAccordion;
