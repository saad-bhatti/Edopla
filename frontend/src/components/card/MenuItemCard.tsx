import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/joy";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import { MenuItem } from "../../models/items/menuItem";
import CustomCard from "../custom/CustomCard";
import CustomCounter from "../custom/CustomCounter";

/** Props of the Vendor component. */
interface MenuItemCardProps {
  menuItem: MenuItem;
  quantity?: number;
  onItemUpdate: (menuItem: MenuItem, quantity: number) => void;
}

/** UI component for a menu item card. */
const MenuItemCard = ({ menuItem, quantity, onItemUpdate }: MenuItemCardProps) => {
  const { name, price, category, description } = menuItem;
  // State to track the quantity of the menu item in the counter.
  const [counterValue, setCounterValue] = useState<number>(quantity ? quantity : 0);

  /**
   * Function to handle the counter change in the menu item card.
   * @param value The new value of the counter.
   * @returns void
   */
  function externalHandleCounterChange(value: number): void {
    setCounterValue(value);
  }

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
          {/* Indicator if the menu item is in the user's cart. */}
          {quantity && (
            <Typography
              level="body-sm"
              sx={{ alignSelf: "center", color: "success.main", fontWeight: "bold" }}
            >
              In cart
            </Typography>
          )}

          {/* Counter */}
          <CustomCounter
            initialValue={counterValue}
            min={0}
            externalCounterChangeHandler={externalHandleCounterChange}
          />

          {/* Add or update item button */}
          <Button
            variant="solid"
            size="sm"
            color="success"
            startDecorator={<AddCircleIcon sx={{ fontSize: "medium" }} />}
            onClick={() => onItemUpdate(menuItem, counterValue)}
          >
            <Typography level="body-xs" sx={{ color: "inherit" }}>
              {quantity !== undefined ? "Update" : "Add"}
            </Typography>
          </Button>
        </Stack>
      </Stack>

      {/* Description */}
      <Stack spacing="0.25rem 1rem" direction="row" useFlexGap flexWrap="wrap" sx={{ my: 0.25 }}>
        <Typography level="body-xs">{description}</Typography>
      </Stack>

      {/* Price */}
      <Stack spacing={0.5} direction="row" alignSelf="flex-end">
        <Typography level="title-md" sx={{ fontWeight: "bold" }}>
          Price
        </Typography>
        <Typography level="body-md">{price}</Typography>
      </Stack>
    </CardContent>
  );

  return <CustomCard cardContent={cardContent} />;
};

export default MenuItemCard;
