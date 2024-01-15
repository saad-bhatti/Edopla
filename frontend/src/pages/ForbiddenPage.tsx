/**************************************************************************************************
 * This file contains the UI for the forbidden page.                                              *
 * This page displays a message when a client lacks the authentication to access a route.         *
 **************************************************************************************************/

import { ErrorPageText } from "../styles/TextSX";

/** UI for the forbidden page. */
const NotFoundPage = () => {
  return <ErrorPageText id="ForbiddenPage">Forbidden.</ErrorPageText>;
};

export default NotFoundPage;
