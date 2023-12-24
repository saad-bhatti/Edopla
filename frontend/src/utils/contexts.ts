import { createContext } from "react";
import { CartItem } from "../models/items/cartItem";
import { User } from "../models/users/user";

/** Custom type for the user context. */
export interface LoggedInUserContextProps {
  loggedInUser: User | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
}

/** Context to track the logged-in user. */
export const LoggedInUserContext = createContext<LoggedInUserContextProps | undefined>(undefined);

/** Custom type for the cart context. */
export interface CartContextProps {
  cart: CartItem[] | null;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

/** Context to track the cart. */
export const CartContext = createContext<CartContextProps | undefined>(undefined);
