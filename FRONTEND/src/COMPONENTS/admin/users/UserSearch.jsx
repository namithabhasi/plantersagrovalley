import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserSearch = ({ search, setSearch }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", md: 350 },
        px: 2,
        py: 0.5,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <InputBase
        sx={{ flex: 1 }}
        placeholder="Search by name, email or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <IconButton>
        <SearchIcon color="action" />
      </IconButton>
    </Paper>
  );
};

export default UserSearch;