import Card from "@mui/joy/Card";
import { SxProps } from "@mui/joy/styles/types";

/** Props of the custom card component. */
interface CustomCardProps {
  cardContent: React.ReactNode;
  sx?: SxProps;
}

/** UI component for a custom card. */
const CustomCard = ({ cardContent, sx }: CustomCardProps) => {
  const customSx: SxProps = {
    bgcolor: "neutral.softBg",
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    "&:hover": {
      boxShadow: "lg",
      borderColor: "var(--joy-palette-neutral-outlinedDisabledBorder)",
    },
    ...sx,
  };

  /** UI layout for the custom card. */
  return (
    <Card variant="outlined" orientation="horizontal" sx={customSx}>
      {cardContent}
    </Card>
  );
};

export default CustomCard;
