/**************************************************************************************************
 * This file contains the UI for the text components.                                             *
 * These components are used to display formatted text in the application.                        *
 **************************************************************************************************/

import InfoOutlined from "@mui/icons-material/InfoOutlined";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { FormHelperText, FormHelperTextProps, Stack, Typography, TypographyProps } from "@mui/joy";
import { ReactElement, ReactNode } from "react";

interface CustomTypographyProps extends TypographyProps {
  children: ReactNode;
  id?: string;
}

interface CustomFormHelperTextProps extends FormHelperTextProps {
  children: ReactNode;
  id?: string;
}

export const mobileScreenInnerWidth = 500;

export const centerText = { textAlign: "center" };

export const ErrorPageText = ({
  id,
  children,
  ...typographyProps
}: CustomTypographyProps): ReactElement => {
  return (
    <Stack
      id={id}
      direction={window.innerWidth <= mobileScreenInnerWidth ? "column" : "row"}
      justifyContent="center"
      gap={5}
      py={10}
    >
      <SentimentVeryDissatisfiedIcon
        sx={{ fontSize: "20vh", margin: window.innerWidth <= mobileScreenInnerWidth ? "auto" : 0 }}
      />
      <SectionTitleText sx={centerText} {...typographyProps}>
        {children}
      </SectionTitleText>
    </Stack>
  );
};

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

export const InfoHelperText = ({
  children,
  ...formHelperTextProps
}: CustomFormHelperTextProps): ReactElement => {
  return (
    <FormHelperText sx={{ ...centerText, fontSize: "small" }} {...formHelperTextProps}>
      {window.innerWidth >= mobileScreenInnerWidth && <InfoOutlined fontSize="small" />}
      {children}
    </FormHelperText>
  );
};
