/**************************************************************************************************
 * This file contains the UI for the carts page.                                                  *
 * The carts page displays all the carts items of the authenticated user.                         *
 * The carts items can be searched and sorted.                                                    *
 **************************************************************************************************/

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button, Container, LinearProgress, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useEffect, useState } from "react";
import CartItemCard from "../components/card/CartItemCard";
import CustomDropdown from "../components/custom/CustomDropdown";
import CustomSearch from "../components/custom/CustomSearch";
import { CartItem } from "../models/items/cartItem";
import * as CartsAPI from "../network/items/carts_api";
import { centerText, mobileScreenInnerWidth } from "../styles/TextSX";
import { CartsContext, SnackbarContext } from "../utils/contexts";
import * as CartsManipulation from "./manipulation/CartsManipulation";

/** UI for the cart page. */
const CartPage = () => {
  // Retrieve the logged in user's cart from the context
  const { carts, setCarts } = useContext(CartsContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(SnackbarContext) || {};
  // State to track whether the cart is being seperated.
  const [isSeperating, setIsSeperating] = useState(true);
  // State to track the active carts.
  const [activeCarts, setActiveCarts] = useState<CartItem[]>(carts!);
  // State to track the carts that are not saved for later.
  const [nowCarts, setNowCarts] = useState<CartItem[]>([]);
  // State to track the carts that are saved for later.
  const [laterCarts, setLaterCarts] = useState<CartItem[]>([]);
  // State to track whether the carts are being searched.
  const [isSearching, setIsSearching] = useState(false);

  /** Seperate the cart by "savedForLater" only once before rendering the page. */
  useEffect(() => {
    function seperateCarts() {
      setIsSeperating(true);

      // Seperate the carts by "savedForLater" if the carts are not empty.
      const [nowCarts, laterCarts] = CartsManipulation.seperateCarts(activeCarts);
      setNowCarts(nowCarts);
      setLaterCarts(laterCarts);

      setIsSeperating(false);
    }
    seperateCarts();
  }, [carts, activeCarts, isSearching]);

  /**
   * Function to search the carts by vendor or item names.
   * @param searchValue The value to search the carts by.
   * @returns Nothing.
   */
  function handleCartsSearch(searchValue: string): void {
    const isSearch: boolean = !searchValue.length ? false : true;
    const filteredCarts: CartItem[] = CartsManipulation.handleSearch(carts!, searchValue);
    setIsSearching(isSearch);
    setActiveCarts(filteredCarts);
  }

  /** Array of functions to execute for each sort option when clicked. */
  const sortFunctions: (() => void)[] = CartsManipulation.sortFunctions.map(
    (sortFn: (cartsToSort: CartItem[]) => CartItem[]) => () => setActiveCarts(sortFn(activeCarts))
  );

  /**
   * Function to handle emptying all carts.
   * @returns Nothing.
   */
  async function emptyAllCarts(): Promise<void> {
    try {
      await CartsAPI.emptyCarts();
      // Remove all carts from the carts context.
      setCarts!([]);
      setActiveCarts([]);

      // Show snackbar to indicate success.
      setSnackbar!({
        text: "All carts emptied successfully!",
        color: "success",
        visible: true,
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbar!({
        text: "Failed to empty all carts.",
        color: "danger",
        visible: true,
      });
    }
  }

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
      setCarts!(carts!.filter((cartItem) => cartItem._id !== cartItemToEmpty._id));
      // Remove the cart from the active carts.
      setActiveCarts(activeCarts.filter((cartItem) => cartItem._id !== cartItemToEmpty._id));

      // Remove the cart from its respective cart.
      cartItemToEmpty.savedForLater
        ? setLaterCarts(laterCarts.filter((cartItem) => cartItem._id !== cartItemToEmpty._id))
        : setNowCarts(nowCarts.filter((cartItem) => cartItem._id !== cartItemToEmpty._id));

      // Show snackbar to indicate success.
      setSnackbar!({
        text: "Cart emptied successfully!",
        color: "success",
        visible: true,
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbar!({
        text: "Failed to empty cart.",
        color: "danger",
        visible: true,
      });
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
      setCarts!(
        carts!.map((traversalCartItem) => {
          if (traversalCartItem._id === cartItem._id) return updatedCart;
          return traversalCartItem;
        })
      );

      // Update the active carts.
      setActiveCarts(
        activeCarts.map((traversalCartItem) => {
          if (traversalCartItem._id === cartItem._id) return updatedCart;
          return traversalCartItem;
        })
      );

      // Show snackbar to indicate success.
      setSnackbar!({
        text: "Cart updated successfully!",
        color: "success",
        visible: true,
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbar!({
        text: "Failed to update cart.",
        color: "danger",
        visible: true,
      });
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
      if (!updatedCart.items.length) emptyCart(cartItem);
      else {
        // Update the cart in the carts context.
        setCarts!(
          carts!.map((traversalCartItem) => {
            if (traversalCartItem._id === cartItem._id) return updatedCart;
            return traversalCartItem;
          })
        );
        // Update the active carts.
        setActiveCarts(
          activeCarts.map((traversalCartItem) => {
            if (traversalCartItem._id === cartItem._id) return updatedCart;
            return traversalCartItem;
          })
        );

        // Show snackbar to indicate success.
        setSnackbar!({
          text: "Item deleted successfully!",
          color: "success",
          visible: true,
        });
      }
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbar!({
        text: "Failed to delete item.",
        color: "danger",
        visible: true,
      });
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
      setCarts!(
        carts!.map((cartItem) => {
          if (cartItem._id === cartItemToToggle._id) return updatedCart;
          return cartItem;
        })
      );

      // Update the active carts.
      setActiveCarts(
        activeCarts.map((cartItem) => {
          if (cartItem._id === cartItemToToggle._id) return updatedCart;
          return cartItem;
        })
      );

      // Show snackbar to indicate success.
      setSnackbar!({
        text: "Successfully updated the cart!",
        color: "success",
        visible: true,
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbar!({
        text: "Failed to update cart.",
        color: "danger",
        visible: true,
      });
    }
  }

  /** Function to handle checking out. */
  function onCheckout() {
    setSnackbar!({
      text: "This feature is coming soon! Thank you for your patience.",
      color: "primary",
      visible: true,
    });
  }

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
            onCheckout={onCheckout}
          />
        ))}
      </Stack>
    ) : (
      <Typography level="body-lg" sx={centerText}>
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
            onCheckout={onCheckout}
          />
        ))}
      </Stack>
    ) : (
      <Typography level="body-lg" sx={centerText}>
        You have no carts that are saved for later.
      </Typography>
    );

  /** Sx for the carts page. */
  const customSx: SxProps = {
    py: 5,
  };

  return (
    <Container id="CartsPage" sx={customSx}>
      {/* Search bar. */}
      <CustomSearch
        placeholder="Search by vendor or item"
        initialValue=""
        activeSearch={true}
        onSearch={handleCartsSearch}
        sx={{
          maxWidth: window.innerWidth <= mobileScreenInnerWidth ? "100%" : "50%",
          mx: "auto",
          mb: window.innerWidth <= mobileScreenInnerWidth ? "3%" : "0%",
        }}
      />

      {/* Sort options and empty all carts button. */}
      <Stack useFlexGap direction="row" spacing={2} justifyContent="space-between" flexWrap="wrap">
        {/* Dropdown for the sort options. */}
        <CustomDropdown
          label="Sort by"
          options={CartsManipulation.sortOptions}
          onOptionClick={sortFunctions}
          variant="plain"
          color="primary"
        />

        {/* Button to empty all carts. */}
        <Button
          variant="solid"
          size="sm"
          color="danger"
          onClick={() => {
            emptyAllCarts();
          }}
          startDecorator={<DeleteForeverIcon />}
          disabled={!carts?.length}
        >
          Empty all carts
        </Button>
      </Stack>

      {/* Display for the indicator while the carts are being seperated. */}
      {isSeperating && <LinearProgress size="lg" value={28} variant="soft" />}

      {/* Display for the cart items. */}
      {!isSeperating && (
        <>
          {/* Display for the "now" carts. */}
          <Typography level="h3" sx={{ mt: 1, mb: 2 }}>
            Active Carts
          </Typography>
          {nowCartsStack}

          {/* Display for the "later" carts. */}
          <Typography level="h3" sx={{ mt: 1, mb: 2 }}>
            Saved for later
          </Typography>
          {laterCartsStack}
        </>
      )}
    </Container>
  );
};

export default CartPage;
