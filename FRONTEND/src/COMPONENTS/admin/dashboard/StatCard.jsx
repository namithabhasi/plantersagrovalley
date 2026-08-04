import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({
  title,
  value,
  icon,
  color = "#1976d2",
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "var(--radius-lg)",
        height: "100%",
        borderColor: "var(--color-border)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {value}
          </Typography>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: `${color}20`,
              color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;