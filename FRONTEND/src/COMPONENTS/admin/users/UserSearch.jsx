import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const UserSearch = ({ search, setSearch }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: "100%", sm: 350, md: 450 },
        flexShrink: 0,
        height: 40,
        boxSizing: "border-box",
        px: 2,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <InputBase
        sx={{ flex: 1, height: "100%" }}
        placeholder="Search by name, email or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <IconButton sx={{ p: 0.5 }}>
        <SearchIcon color="action" />
      </IconButton>
    </Paper>
  );
};

export default UserSearch;