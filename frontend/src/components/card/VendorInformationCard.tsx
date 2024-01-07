/**************************************************************************************************
 * This file contains the UI for the vendor information card.                                     *
 * The vendor information card allows the buyer to view the vendor's information, toggle the      *
 * vendor's saved status, and see the vendor's menu.                                              *
 * The vendor information card is displayed in the buyer page.                                    *
 **************************************************************************************************/

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Button } from "@mui/joy";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { SxProps } from "@mui/joy/styles/types";
import { useNavigate } from "react-router-dom";
import { Vendor } from "../../models/users/vendor";
import CustomCard from "../custom/CustomCard";

/** Props of the vendor information card component. */
interface VendorInformationCardProps {
  vendor: Vendor;
  isSaved: boolean;
  onSaveToggled: (vendor: Vendor) => void;
  isCart?: boolean;
  sx?: SxProps;
}

/** UI component for a vendor information card. */
const VendorInformationCard = ({
  vendor,
  isSaved,
  onSaveToggled,
  isCart,
  sx,
}: VendorInformationCardProps) => {
  // Retrieve vendor info from props.
  const { vendorName, address, phoneNumber, priceRange, description, cuisineTypes } = vendor;
  // Create the navigation object.
  const navigate = useNavigate();

  /** UI layout for the vendor information card. */
  const cardContent = (
    <CardContent>
      <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start">
        {/* Vendor cuisine types and name. */}
        <Stack direction="column">
          <Typography level="body-sm">{cuisineTypes.join(", ")}</Typography>
          <Typography level="title-md">{vendorName}</Typography>
        </Stack>

        {/* Vendor's address and phone number. */}
        <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography level="body-xs">{address}</Typography>
          <Typography level="body-xs">|</Typography>
          <Typography level="body-xs">{phoneNumber}</Typography>
        </Stack>
      </Stack>

      {/* Vendor's price range and description */}
      <Stack spacing="0.25rem 1rem" direction="column" useFlexGap flexWrap="wrap" sx={{ my: 0.25 }}>
        <Typography level="body-xs">{priceRange}</Typography>
        <Typography level="body-xs">{description}</Typography>
      </Stack>

      {/* Save and order buttons */}
      <Stack spacing={0.5} direction="row" alignSelf="flex-end">
        {isCart !== true && (
          <Button
            variant="soft"
            color="primary"
            onClick={() => onSaveToggled(vendor)}
            startDecorator={<BookmarkIcon fontSize="small" />}
          >
            {isSaved ? "Unsave" : "Save"}
          </Button>
        )}
        <Button
          variant="solid"
          color="success"
          onClick={() => {
            navigate(`/menu/${vendor._id}`);
          }}
          startDecorator={<AddShoppingCartIcon fontSize="small" />}
        >
          Order
        </Button>
      </Stack>
    </CardContent>
  );

  return <CustomCard cardContent={cardContent} sx={sx} />;
};

export default VendorInformationCard;
