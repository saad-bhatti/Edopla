import Card from "@mui/joy/Card";

/** Props of the Vendor component. */
interface CustomCardProps {
  cardContent: React.ReactNode;
}

/** UI component for a menu item card. */
const CustomCard = ({ cardContent }: CustomCardProps) => {
  /** UI layout for the menu item card. */
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        bgcolor: "neutral.softBg",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        "&:hover": {
          boxShadow: "lg",
          borderColor: "var(--joy-palette-neutral-outlinedDisabledBorder)",
        },
      }}
    >
      {cardContent}
    </Card>
  );
};

export default CustomCard;
