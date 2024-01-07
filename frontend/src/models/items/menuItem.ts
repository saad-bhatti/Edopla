/**************************************************************************************************
 * This file creates the interface for the Menu Item object.                                      *
 **************************************************************************************************/

/** "Type" for Menu Item object. */
export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  expitreAt?: string;
}
