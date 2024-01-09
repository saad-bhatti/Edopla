/**************************************************************************************************
 * This file contains the UI for the cart item card.                                              *
 * The cart item card allows the buyer to change the quantity of items in their cart.             *
 * The cart item card is displayed in the cart page.                                              *
 **************************************************************************************************/

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/joy";
import CardContent from "@mui/joy/CardContent";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartItem } from "../../models/items/cartItem";
import CustomCard from "../custom/CustomCard";
import CustomCounter from "../custom/CustomCounter";

/** Props of the cart item card component. */
interface CartItemCardProps {
  cartItem: CartItem;
  onEmpty: (cart: CartItem) => void;
  onUpdateCart: (cart: CartItem, items: { item: string; quantity: number }[]) => void;
  onDeleteItem: (cart: CartItem, itemId: string) => void;
  onSaveForLater: (cart: CartItem) => void;
}

/** UI component for a cart item card. */
const CartItemCard = ({
  cartItem,
  onEmpty,
  onUpdateCart,
  onDeleteItem,
  onSaveForLater,
}: CartItemCardProps) => {
  // Retrieve the cart item's vendor ID, items, and saved for later status.
  const { vendorId, items, savedForLater } = cartItem;
  // Local state to store counter values
  const [updatedQuantities, setUpdatedQuantities] = useState<{ [itemId: string]: number }>({});
  // State to track if the cart is in edit mode.
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // State to track the cart item's total price.
  const [totalPrice, setTotalPrice] = useState<number>(0);

  /**
   * Function to handle counter value change.
   * @param itemId The ID of the item whose counter value changed.
   * @param updatedQuantity The updated quantity of the item.
   * @returns Nothing.
   */
  function handleCounterChange(itemId: string, updatedQuantity: number): void {
    setUpdatedQuantities((prevQuantities) => ({ ...prevQuantities, [itemId]: updatedQuantity }));
  }

  /** Function to calculate the cart item's total price. */
  useEffect(() => {
    function calculateTotalPrice(): void {
      let total = 0;
      items.forEach(({ item, quantity }) => {
        total += item.price * quantity;
      });
      setTotalPrice(total);
    }
    calculateTotalPrice();
  }, [items]);

  /** UI layout for the cart item card. */
  const cardContent = (
    <CardContent>
      {/* Card header. */}
      <Stack spacing={1} direction="row" justifyContent="space-between" alignItems="flex-start">
        {/* Vendor name. */}
        <Link to={`/menu/${vendorId._id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <Typography level="h4" style={{ cursor: "pointer" }}>
            {vendorId.vendorName}
          </Typography>
        </Link>

        {!isEditMode ? (
          /* Buttons in non-edit mode. */
          <Stack spacing={0} direction="row" alignItems="flex-start">
            {/* Edit cart button. */}
            <IconButton variant="plain" onClick={() => setIsEditMode(true)}>
              <EditIcon />
            </IconButton>

            {/* Empty cart button. */}
            <IconButton
              variant="plain"
              color="danger"
              onClick={() => {
                onEmpty(cartItem);
              }}
            >
              <RemoveShoppingCartIcon />
            </IconButton>
          </Stack>
        ) : (
          /* Buttons in edit mode. */
          <Stack spacing={0} direction="row" alignItems="flex-start">
            {/* Cancel changes button. */}
            <IconButton
              variant="plain"
              size="sm"
              color="danger"
              onClick={() => {
                setUpdatedQuantities({}); // Reset the updates in quantities in the local state
                setIsEditMode(false);
              }}
            >
              <CancelIcon />
            </IconButton>

            {/* Accept changes button. */}
            <IconButton
              variant="plain"
              size="sm"
              color="success"
              onClick={() => {
                // Update the items with the new quantities
                const updatedItems = items.map(({ item, quantity }) => {
                  const updatedQuantity = updatedQuantities[item._id] ?? quantity;
                  return { item: item._id, quantity: updatedQuantity };
                });
                onUpdateCart(cartItem, updatedItems); // Update the cart

                setUpdatedQuantities({}); // Clear the local state after updating
                setIsEditMode(false); // Exit edit mode
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>

      {/* Divider. */}
      <Divider sx={{ border: "1px solid #000" }} />

      {/* Items list. */}
      <Stack spacing={2} sx={{ overflow: "auto" }}>
        {items.map(({ item, quantity }) => (
          /* Container for each item. */
          <Stack
            key={item._id}
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* Item name. */}
            <Typography level="body-md" sx={{ fontWeight: "bolder", width: "20%" }}>
              {item.name}
            </Typography>

            {/* Item price. */}
            <Stack spacing={1} direction="column" alignItems="flex-start">
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Price
              </Typography>
              <Typography
                level="body-sm"
                sx={{ alignSelf: "center" }}
              >{`$${item.price}`}</Typography>
            </Stack>

            {/* Item quantity. */}
            <Stack spacing={1} direction="column" alignItems="flex-start">
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Quantity
              </Typography>
              {isEditMode ? (
                <CustomCounter
                  initialValue={quantity}
                  min={0}
                  externalCounterChangeHandler={(updatedQuantity) =>
                    handleCounterChange(item._id, updatedQuantity)
                  }
                  sx={{ alignSelf: "center" }}
                />
              ) : (
                <Typography level="body-sm" sx={{ alignSelf: "flex-end" }}>
                  {quantity}
                </Typography>
              )}
            </Stack>

            {/* Item total price. */}
            <Stack spacing={1} direction="column" alignItems="flex-end">
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Total
              </Typography>
              <Typography level="body-sm">{`$${
                Math.round(item.price * quantity * 100) / 100
              }`}</Typography>
            </Stack>

            {/* Delete button when editing. */}
            {isEditMode && (
              <IconButton
                variant="plain"
                size="sm"
                color="danger"
                onClick={() => {
                  onDeleteItem(cartItem, item._id);
                }}
                sx={{ alignSelf: "center" }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ border: "1px solid #000" }} />

      {/* Total price. */}
      <Stack spacing={1} direction="row" justifyContent="space-between">
        <Typography level="body-md" sx={{ fontWeight: "bold" }}>
          Cart Total
        </Typography>
        <Typography level="body-sm">{`$${Math.round(totalPrice * 100) / 100}`}</Typography>
      </Stack>

      {/* General buttons. */}
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        {/* Add items button. */}
        <Link to={`/menu/${vendorId._id}`}>
          <Button
            variant="outlined"
            size="sm"
            startDecorator={<AddCircleIcon sx={{ fontSize: "medium" }} />}
          >
            Add items
          </Button>
        </Link>

        {/* Save for later button. */}
        <Button
          variant="outlined"
          size="sm"
          startDecorator={<WatchLaterIcon sx={{ fontSize: "medium" }} />}
          onClick={() => onSaveForLater(cartItem)}
        >
          {!savedForLater ? "Save for later" : "Move to active carts"}
        </Button>

        {/* Checkout button. TODO: On click option. */}
        <Button
          variant="outlined"
          size="sm"
          startDecorator={<LockIcon sx={{ fontSize: "medium" }} />}
        >
          Checkout
        </Button>
      </Stack>
    </CardContent>
  );

  /** Return the custom card with the card content. */
  return <CustomCard cardContent={cardContent} />;
};

export default CartItemCard;
