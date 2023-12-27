import { LinearProgress, Stack, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import CartItemCard from "../../components/card/CartItemCard";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomSearch from "../../components/custom/CustomSearch";
import { displayError } from "../../errors/displayError";
import { CartItem } from "../../models/items/cartItem";
import * as CartsAPI from "../../network/items/carts_api";
import { CartsContext, CartsContextProps } from "../../utils/contexts";

/** UI for the cart page. */
const CartPage = () => {
  // Retrieve the logged in user's cart from the context
  const { carts, setCarts } = useContext<CartsContextProps | null>(CartsContext) || {};
  // State to track whether the cart is being seperated.
  const [isSeperating, setIsSeperating] = useState(true);
  // State to track the carts that are not saved for later.
  const [nowCarts, setNowCarts] = useState<CartItem[]>([]);
  // State to track the carts that are saved for later.
  const [laterCarts, setLaterCarts] = useState<CartItem[]>([]);

  /**
   * Function to handle emptying a cart item.
   * @param cartItemToEmpty The cart item to empty.
   * @returns Nothing.
   */
  async function emptyCart(cartItemToEmpty: CartItem): Promise<void> {
    try {
      // Send request to empty the specified cart.
      await CartsAPI.emptyCart(cartItemToEmpty._id);

      // Remove the cart from the carts list.
      if (setCarts && carts)
        setCarts(carts.filter((cartItem) => cartItem._id !== cartItemToEmpty._id));

      // Remove the cart from its respective cart.
      cartItemToEmpty.savedForLater
        ? setLaterCarts(laterCarts.filter((cartItem) => cartItem._id !== cartItemToEmpty._id))
        : setNowCarts(nowCarts.filter((cartItem) => cartItem._id !== cartItemToEmpty._id));
    } catch (error) {
      displayError(error);
      alert(error);
    }
  }

  /**
   * Function to update the items in the specified cart item.
   * @param cartItem The cart item to update the items of.
   * @param items The array updated items and their quantities of the cart item.
   * @returns Nothing.
   */
  async function updateCart(
    cartItem: CartItem,
    items: { item: string; quantity: number }[]
  ): Promise<void> {
    try {
      // Send request to update the cart item's items.
      const requestBody = { items: items };
      const updatedCart = await CartsAPI.updateCart(cartItem._id, requestBody);

      // Update the cart in the carts context.
      if (setCarts && carts)
        setCarts(
          carts.map((traversalCartItem) => {
            if (traversalCartItem._id === cartItem._id) return updatedCart;
            return traversalCartItem;
          })
        );
    } catch (error) {
      displayError(error);
      alert(error);
    }
  }

  /**
   * Function to delete an item from the specified cart item.
   * @param cartItem The cart item to delete the item from.
   * @param itemId The ID of the item to be delete.
   * @returns Nothing.
   */
  async function deleteItem(cartItem: CartItem, itemId: string): Promise<void> {
    try {
      // Send request to toggle the cart item's "savedForLater" status.
      const requestDetails = { item: { item: itemId, quantity: 0 } };
      const updatedCart = await CartsAPI.updateItem(cartItem._id, requestDetails);

      // If the updated cart is empty, delete the cart from the database.
      if (!updatedCart.items.length && setCarts && carts) emptyCart(cartItem);
      // Otherwise, update the cart in the carts context.
      else if (setCarts && carts)
        setCarts(
          carts.map((traversalCartItem) => {
            if (traversalCartItem._id === cartItem._id) return updatedCart;
            return traversalCartItem;
          })
        );
    } catch (error) {
      displayError(error);
      alert(error);
    }
  }

  /**
   * Function to handle toggling a cart item's "savedForLater" status.
   * @param cartItemToToggle The cart item to toggle.
   * @returns Nothing.
   */
  async function saveForLater(cartItemToToggle: CartItem): Promise<void> {
    try {
      // Send request to toggle the cart item's "savedForLater" status.
      const updatedCart = await CartsAPI.toggleSaveForLater(cartItemToToggle._id);

      // Update the cart in the carts context.
      if (setCarts && carts)
        setCarts(
          carts.map((cartItem) => {
            if (cartItem._id === cartItemToToggle._id) return updatedCart;
            return cartItem;
          })
        );
    } catch (error) {
      displayError(error);
      alert(error);
    }
  }

  /** Seperate the cart by "savedForLater" only once before rendering the page. */
  useEffect(() => {
    function seperateCarts() {
      setIsSeperating(true);

      // Seperate the carts by "savedForLater" if the carts are not empty.
      if (carts !== undefined && carts !== null && carts.length) {
        const nowCarts: CartItem[] = [];
        const laterCarts: CartItem[] = [];
        carts.forEach((cartItem: CartItem) => {
          if (cartItem.savedForLater) laterCarts.push(cartItem);
          else nowCarts.push(cartItem);
        });
        setNowCarts(nowCarts);
        setLaterCarts(laterCarts);
      }

      setIsSeperating(false);
    }
    seperateCarts();
  }, [carts]);

  /** Variable containing the display for all "now" cart items. */
  const nowCartsStack =
    nowCarts.length > 0 ? (
      <Stack spacing={2} sx={{ overflow: "auto" }}>
        {nowCarts.map((cartItem: CartItem, index: number) => (
          <CartItemCard
            key={index}
            cartItem={cartItem}
            onEmpty={emptyCart}
            onUpdateCart={updateCart}
            onDeleteItem={deleteItem}
            onSaveForLater={saveForLater}
          />
        ))}
      </Stack>
    ) : (
      <Typography level="body-lg" sx={{ textAlign: "center" }}>
        You have no active carts.
      </Typography>
    );

  /** Variable containing the display for all "later" cart items. */
  const laterCartsStack =
    laterCarts.length > 0 ? (
      <Stack spacing={2} sx={{ overflow: "auto" }}>
        {laterCarts.map((cartItem: CartItem, index: number) => (
          <CartItemCard
            key={index}
            cartItem={cartItem}
            onEmpty={emptyCart}
            onUpdateCart={updateCart}
            onDeleteItem={deleteItem}
            onSaveForLater={saveForLater}
          />
        ))}
      </Stack>
    ) : (
      <Typography level="body-lg" sx={{ textAlign: "center" }}>
        You have no carts that are saved for later.
      </Typography>
    );

  return (
    <>
      <Stack
        useFlexGap
        direction="row"
        spacing={{ xs: 0, sm: 2 }}
        justifyContent={{ xs: "space-between" }}
        flexWrap="wrap"
        sx={{ minWidth: 0 }}
        margin={{ xs: "0 0 5px 0" }}
      >
        {/* Search bar. */}
        <CustomSearch
          placeholder="Search by vendor or item"
          initialValue=""
          activeSearch={true}
          onSearch={() => {}}
          sx={{ width: "50%" }}
        />

        {/* Dropdown for the sort options. */}
        <CustomDropdown
          label="Sort by"
          options={[]}
          onOptionClick={[]}
          variant="plain"
          color="primary"
        />
      </Stack>

      {/* Display for the indicator while the carts are being seperated. */}
      {isSeperating && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for the cart items. */}
      {!isSeperating && (
        <>
          {/* Display for the "now" carts. */}
          <Typography level="h3" sx={{ mt: 3, mb: 2 }}>
            Active Carts
          </Typography>
          {nowCartsStack}

          {/* Display for the "later" carts. */}
          <Typography level="h3" sx={{ mt: 3, mb: 2 }}>
            Saved for later
          </Typography>
          {laterCartsStack}
        </>
      )}
    </>
  );
};

export default CartPage;
