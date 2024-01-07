/**************************************************************************************************
 * This file contains the UI for the text components.                                             *
 * These components are used to display formatted text in the application.                        *
 **************************************************************************************************/

import { Typography, TypographyProps } from "@mui/joy";
import { ReactElement, ReactNode } from "react";

interface CustomTypographyProps extends TypographyProps {
  children: ReactNode;
}

export const SectionTitleText = ({
  children,
  ...typographyProps
}: CustomTypographyProps): ReactElement => {
  return (
    <Typography level="h1" fontFamily="Mona Sans" fontSize="10vh" {...typographyProps}>
      {children}
    </Typography>
  );
};

export const SubSectionTitleText = ({
  children,
  ...typographyProps
}: CustomTypographyProps): ReactElement => {
  return (
    <Typography level="h2" fontFamily="Mona Sans" fontSize="5vh" {...typographyProps}>
      {children}
    </Typography>
  );
};

export const LargeBodyText = ({
  children,
  ...typographyProps
}: CustomTypographyProps): ReactElement => {
  return (
    <Typography level="body-lg" fontFamily="Mona Sans" {...typographyProps}>
      {children}
    </Typography>
  );
};
