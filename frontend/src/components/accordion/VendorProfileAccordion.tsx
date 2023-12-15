import { Vendor as VendorModel } from "../../models/users/vendor";
import CustomAccordion from "./CustomAccordion";

/** Props of the vendor profile accordion component. */
interface VendorProfileProps {
  vendor: VendorModel;
  onEditVendorClicked: () => void;
  className?: string;
}

/** UI component for a buyer profile card. */
const VendorProfileAccordion = ({ vendor, onEditVendorClicked, className }: VendorProfileProps) => {
  const { vendorName, address, priceRange, phoneNumber, description, cuisineTypes } = vendor;

  /** UI layout for the  card. */
  return (
    <CustomAccordion
      headerText="Vendor Profile"
      listGroupText={[
        "Name",
        "Address",
        "Price Range",
        "Phone Number",
        "Description",
        "Cuisine Types",
      ]}
      listGroupValues={[
        vendorName,
        address,
        priceRange,
        phoneNumber ?? "",
        description ?? "",
        cuisineTypes.join(", "),
      ]}
      buttonText="Edit"
      onButtonClicked={onEditVendorClicked}
      className={className}
    />
  );
};

export default VendorProfileAccordion;
