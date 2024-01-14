/**************************************************************************************************
 * This file contains the contexts used in the application.                                       *
 * The current contexts are for the snackbar, user, and the cart.                                 *
 **************************************************************************************************/

import { createContext } from "react";
import { CartItem } from "../models/items/cartItem";
import { User } from "../models/users/user";

/** Custom type for the snackbar color. */
export type snackBarColor = "primary" | "neutral" | "danger" | "success" | "warning";

/** Custom type for the snackbar context. */
export interface SnackbarContextProps {
  snackbar: {
    text: string;
    color: snackBarColor;
    visible: boolean;
  };
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      text: string;
      color: snackBarColor;
      visible: boolean;
    }>
  >;
}

/** Context to track the snackbar. */
export const SnackbarContext = createContext<SnackbarContextProps | null>(null);

/** Custom type for the user context. */
export interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

/** Context to track the logged-in user. */
export const UserContext = createContext<UserContextProps | null>(null);

/** Custom type for the cart context. */
export interface CartsContextProps {
  carts: CartItem[];
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

/** Context to track the cart. */
export const CartsContext = createContext<CartsContextProps | null>(null);
