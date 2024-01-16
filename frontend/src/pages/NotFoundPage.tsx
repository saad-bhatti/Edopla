/**************************************************************************************************
 * This file contains the UI for the not found page.                                              *
 * This page is used to display a message when a route is not found.                              *
 **************************************************************************************************/

import { ErrorPageText } from "../styles/TextSX";

/** UI for the not found page. */
const NotFoundPage = () => {
  return <ErrorPageText id="NotFoundPage">Page not found.</ErrorPageText>;
};

export default NotFoundPage;
