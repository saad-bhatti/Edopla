/**************************************************************************************************
 * This file creates the interface for the User object.                                           *
 **************************************************************************************************/

/** "Type" for User object. */
export interface User {
  email: string;
  thirdParty: boolean;
  _buyer: string;
  _vendor: string;
}
