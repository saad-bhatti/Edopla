/**************************************************************************************************
 * This file contains the UI for the carts page.                                                  *
 * The carts page displays all the carts items of the authenticated user.                         *
 * The carts items can be searched and sorted.                                                    *
 **************************************************************************************************/

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Button, Container, LinearProgress, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useContext, useEffect, useState } from "react";
import CartItemCard from "../../components/card/CartItemCard";
import CustomDropdown from "../../components/custom/CustomDropdown";
import CustomSearch from "../../components/custom/CustomSearch";
import CustomSnackbar from "../../components/custom/CustomSnackbar";
import { CartItem } from "../../models/items/cartItem";
import * as CartsAPI from "../../network/items/carts_api";
import { minPageHeight, minPageWidth } from "../../styles/constants";
import { CartsContext, CartsContextProps } from "../../utils/contexts";
import * as CartsManipulation from "./CartsManipulation";

/** UI for the cart page. */
const CartPage = () => {
  // Retrieve the logged in user's cart from the context
  const { carts, setCarts } = useContext<CartsContextProps | null>(CartsContext) || {};
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

  // State to control the display of the snackbar.
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  // State to track the text and color of the snackbar.
  type possibleColors = "primary" | "neutral" | "danger" | "success" | "warning";
  const [snackbarFormat, setSnackbarFormat] = useState<{
    text: string;
    color: possibleColors;
  }>({
    text: "",
    color: "primary",
  });

  /** Seperate the cart by "savedForLater" only once before rendering the page. */
  useEffect(() => {
    function seperateCarts() {
      setIsSeperating(true);

      // Load the carts from local storage if the carts context is empty.
      if (!activeCarts?.length && !isSearching) {
        const cartsFromLocalStorage = localStorage.getItem("carts");
        if (cartsFromLocalStorage) setActiveCarts!(JSON.parse(cartsFromLocalStorage));
      }

      // Seperate the carts by "savedForLater" if the carts are not empty.
      const [nowCarts, laterCarts] = CartsManipulation.seperateCarts(activeCarts);
      setNowCarts(nowCarts);
      setLaterCarts(laterCarts);

      // Store the carts in local storage.
      localStorage.setItem("carts", JSON.stringify(carts));

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

      // Store an empty carts in local storage.
      localStorage.setItem("carts", JSON.stringify([]));
      setCarts!([]);
      setActiveCarts([]);

      setSnackbarFormat({
        text: "All carts emptied successfully!",
        color: "success",
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to empty all carts.",
        color: "danger",
      });
    } finally {
      setSnackbarVisible(true);
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
      setSnackbarFormat({
        text: "Cart emptied successfully!",
        color: "success",
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to empty cart.",
        color: "danger",
      });
    } finally {
      setSnackbarVisible(true);
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
      setSnackbarFormat({
        text: "Cart updated successfully!",
        color: "success",
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to update cart.",
        color: "danger",
      });
    } finally {
      setSnackbarVisible(true);
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
        setSnackbarFormat({
          text: "Item deleted successfully!",
          color: "success",
        });
      }
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to delete item",
        color: "danger",
      });
    } finally {
      setSnackbarVisible(true);
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
      setSnackbarFormat({
        text: "Successfully updated the cart!",
        color: "success",
      });
    } catch (error) {
      // Show snackbar to indicate failure.
      setSnackbarFormat({
        text: "Failed to update cart.",
        color: "danger",
      });
    } finally {
      setSnackbarVisible(true);
    }
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

  /** UI layout for the snackbar. */
  const snackbar = (
    <CustomSnackbar
      content={snackbarFormat.text}
      color={snackbarFormat.color}
      open={snackbarVisible}
      onClose={() => {
        setSnackbarVisible(false);
      }}
      startDecorator={<InfoOutlined fontSize="small" />}
    />
  );

  /** Sx for the carts page. */
  const customSx: SxProps = {
    py: 5,
    minWidth: minPageWidth,
    minHeight: minPageHeight,
  };

  return (
    <Container id="CartsPage" sx={customSx}>
      {/* Snackbar. */}
      {snackbar}

      <Stack
        useFlexGap
        direction="row"
        spacing={{ xs: 0, sm: 2 }}
        justifyContent={{ xs: "space-between" }}
        flexWrap="wrap"
        sx={{ minWidth: 0 }}
        margin={{ xs: "0 0 5px 0" }}
      >
        {/* Dropdown for the sort options. */}
        <CustomDropdown
          label="Sort by"
          options={CartsManipulation.sortOptions}
          onOptionClick={sortFunctions}
          variant="plain"
          color="primary"
        />

        {/* Search bar. */}
        <CustomSearch
          placeholder="Search by vendor or item"
          initialValue=""
          activeSearch={true}
          onSearch={handleCartsSearch}
          sx={{ width: "30%" }}
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
    </Container>
  );
};

export default CartPage;
