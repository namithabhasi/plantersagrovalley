import {
  Avatar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

const TopProducts = ({ products = [] }) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          Top Selling Products
        </Typography>

        {products.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            No products found.
          </Typography>
        ) : (
          <List>
            {products.map((product, index) => (
              <Box key={product._id || index}>
                <ListItem
                  alignItems="flex-start"
                  disableGutters
                >
                  <ListItemAvatar>
                    <Avatar
                      src={product.images?.[0]?.url || ""}
                      alt={product.name}
                      variant="rounded"
                      sx={{
                        width: 60,
                        height: 60,
                        mr: 2,
                      }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography fontWeight="bold">
                        {product.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Sold: {product.totalSold || 0}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Revenue: ₹
                          {Number(
                            product.totalRevenue || 0
                          ).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />

                  <Chip
                    label={`Stock: ${product.stock}`}
                    color={
                      product.stock <= 10
                        ? "error"
                        : "success"
                    }
                    size="small"
                  />
                </ListItem>

                {index !== products.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProducts;