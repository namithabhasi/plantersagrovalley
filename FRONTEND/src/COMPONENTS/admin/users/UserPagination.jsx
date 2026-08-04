import { Pagination, Stack } from "@mui/material";

const UserPagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
      <Pagination
        page={page}
        count={totalPages}
        onChange={(e, value) => setPage(value)}
        color="primary"
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "var(--radius-full)",
            "&.Mui-selected": {
              bgcolor: "var(--color-primary-dark)",
              color: "#fff",
              "&:hover": {
                bgcolor: "var(--color-primary)",
                color: "#fff",
              },
            },
            "&:hover": {
              bgcolor: "var(--color-primary-subtle)",
              color: "var(--color-primary-dark)",
            },
          },
        }}
      />
    </Stack>
  );
};

export default UserPagination;