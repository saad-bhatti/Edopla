import { createContext } from "react";
import { CartItem } from "../models/items/cartItem";
import { User } from "../models/users/user";

/** Custom type for the user context. */
export interface LoggedInUserContextProps {
  loggedInUser: User | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null>>;
}

/** Context to track the logged-in user. */
export const LoggedInUserContext = createContext<LoggedInUserContextProps | null>(null);

/** Custom type for the cart context. */
export interface CartsContextProps {
  carts: CartItem[];
  setCarts: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

/** Context to track the cart. */
export const CartsContext = createContext<CartsContextProps | null>(null);
