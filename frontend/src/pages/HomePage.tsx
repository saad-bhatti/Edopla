/**************************************************************************************************
 * This file contains the UI for the home page.                                                   *
 * This page is used to display the general information and features of the application.          *
 **************************************************************************************************/

import Stack from "@mui/joy/Stack";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomAnimation from "../components/custom/CustomAnimation";
import About from "../components/section/home/AboutSection";
import Contact from "../components/section/home/ContactSection";
import Features from "../components/section/home/FeaturesSection";
import Header from "../components/section/home/HeaderSection";
import Meet from "../components/section/home/MeetSection";
import { displayError } from "../errors/displayError";
import { User } from "../models/users/user";
import { getCarts } from "../network/items/carts_api";
import { authenticateGitHub, linkAuthentication } from "../network/users/users_api";
import * as Context from "../utils/contexts";

/** UI for the home page. */
const HomePage = () => {
  // Used to navigate to different pages
  const navigator = useNavigate();
  // Retrieve the set logged in user function from the context
  const { user, setUser } = useContext(Context.UserContext) || {};
  // Retrieve the set cart function from the context
  const { setCarts } = useContext(Context.CartsContext) || {};
  // Retrieve the snackbar from the context
  const { setSnackbar } = useContext(Context.SnackbarContext) || {};

  /**
   * Function to set the snackbar format and its visibility.
   * @param text The text to display in the snackbar.
   * @param color The color of the snackbar.
   * @param visible Whether the snackbar is visible or not.
   */
  function updateSnackbar(text: string, color: Context.snackBarColor, visible: boolean): void {
    setSnackbar!({ text, color, visible });
  }

  /** After GitHub oauth redirect, retrieve the code from the url. */
  useEffect(() => {
    /** Function to handle GitHub account linking. */
    async function linkGitHub(code: string): Promise<void> {
      try {
        // Send a request to link the GitHub account.
        const requestDetails = {
          identifier: "gitHub",
          token: code,
        };
        const authenticatedUser: User = await linkAuthentication(requestDetails);
        setUser!(authenticatedUser);

        // Set the carts for the user.
        authenticatedUser._buyer !== null ? setCarts!(await getCarts()) : setCarts!([]);

        // Set the snackbar to display a success message.
        updateSnackbar("Successfully linked GitHub account!", "success", true);

        // Navigate to the profiles page.
        navigator("/profiles");
      } catch (error) {
        Promise.reject(error);
      }
    }
    /** Function to handle GitHub authentication. */
    async function authenticateWithGitHub(code: string): Promise<void> {
      try {
        // Send a request to authenticate with GitHub.
        const requestDetails = {
          code: code,
        };
        const authenticatedUser = await authenticateGitHub(requestDetails);
        setUser!(authenticatedUser);

        // Set the carts for the user.
        authenticatedUser._buyer !== null ? setCarts!(await getCarts()) : setCarts!([]);

        // Set the snackbar to display a success message.
        updateSnackbar("Successfully authenticated with GitHub!", "success", true);

        // If the client signed up, redirect to the create profile page.
        if (!authenticatedUser._buyer && !authenticatedUser._vendor) navigator("/profiles/create");
      } catch (error) {
        Promise.reject(error);
      }
    }
    /** Function to handle the GitHub code. */
    async function handleGitHubCode(code: string): Promise<void> {
      try {
        // If the user is logged in, link their GitHub account.
        if (user && !user.identification.gitHubId) await linkGitHub(code);
        // If the user is not logged in, authenticate with GitHub.
        else await authenticateWithGitHub(code);
      } catch (error) {
        error instanceof Error
          ? updateSnackbar(error.message, "danger", true)
          : displayError(error);
      }
    }
    // Retrieve the code from the url.
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    // If the code is present, send a request to sign up with GitHub.
    if (codeParam) handleGitHubCode(codeParam);

    // If the user is logged in & does not have a profile, redirect them to the create profile page.
    if (user && !user._buyer && !user._vendor) navigator("/profiles/create");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** UI layout for the home page. */
  return (
    <Stack id="HomePage" direction="column" gap={10} m={0} p={0}>
      <CustomAnimation child={<Header />} transformAnimation="translateY(-5%)" />
      <CustomAnimation child={<Features />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<About />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<Meet />} transformAnimation="translateX(-5%)" />
      <CustomAnimation child={<Contact />} transformAnimation="translateY(5%)" />
    </Stack>
  );
};

export default HomePage;
