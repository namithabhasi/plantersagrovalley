import { Pagination, Stack } from "@mui/material";

const UserPagination = ({ page, totalPages, setPage }) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
      <Pagination
        page={page}
        count={totalPages}
        onChange={(e, value) => setPage(value)}
        color="primary"
      />
    </Stack>
  );
};

export default UserPagination;