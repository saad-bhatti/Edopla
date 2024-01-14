/**************************************************************************************************
 * This file creates the interface for the User object.                                           *
 **************************************************************************************************/
/** "Type" for the identification attribute of a user object. */
export interface Identification {
  email?: string;
  googleId?: string;
  gitHubId?: string;
}

/** "Type" for User object. */
export interface User {
  identification: Identification;
  _buyer: string;
  _vendor: string;
}
