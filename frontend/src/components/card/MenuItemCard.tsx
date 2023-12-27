import AddCircleIcon from "@mui/icons-material/AddCircle";
import CardContent from "@mui/joy/CardContent";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { MenuItem } from "../../models/items/menuItem";
import CustomCard from "../custom/CustomCard";
import CustomCounter from "../custom/CustomCounter";

/** Props of the Vendor component. */
interface MenuItemCardProps {
  menuItem: MenuItem;
}

/** UI component for a menu item card. */
const MenuItemCard = ({ menuItem }: MenuItemCardProps) => {
  const { name, price, category, description } = menuItem;

  /** UI layout for the menu item card. */
  const cardContent = (
    <CardContent>
      <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start">
        <div>
          {/* Menu item's category. */}
          <Typography level="body-sm">{category}</Typography>

          {/* Menu item's name. */}
          <Typography level="title-md">{name}</Typography>
        </div>

        <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start">
          {/* Counter */}
          <CustomCounter initialValue={0} min={0} />

          {/* Add to cart button */}
          <IconButton
            variant="plain"
            size="sm"
            onClick={() => {}} // TODO
            sx={{
              display: { xs: "none", sm: "flex" },
              borderRadius: "50%",
            }}
          >
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Description */}
      <Stack spacing="0.25rem 1rem" direction="row" useFlexGap flexWrap="wrap" sx={{ my: 0.25 }}>
        <Typography level="body-xs">{description}</Typography>
      </Stack>

      {/* Price */}
      <Stack direction="row" sx={{ mt: "auto" }}>
        <Typography level="title-lg" sx={{ flexGrow: 1, textAlign: "right" }}>
          <strong>Price</strong> <Typography level="body-md">{price}</Typography>
        </Typography>
      </Stack>
    </CardContent>
  );

  return <CustomCard cardContent={cardContent} />;
};

export default MenuItemCard;
