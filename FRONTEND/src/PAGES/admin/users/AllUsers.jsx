import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery as setSearchQueryRedux } from "../../../redux/search/searchSlice";
import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import UserSearch from "../../../COMPONENTS/admin/users/UserSearch";
import UserFilters from "../../../COMPONENTS/admin/users/UserFilters";
import UserTable from "../../../COMPONENTS/admin/users/UserTable";
import UserPagination from "../../../COMPONENTS/admin/users/UserPagination";
import axios from "../../../api/axiosInstance";

const AllUsers = ({ preselectedRole }) => {
  const dispatch = useDispatch();
  const globalSearchQuery = useSelector((state) => state.search.query);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(preselectedRole || "all");
  const [status, setStatus] = useState("all");

  const getTitle = () => {
    switch (preselectedRole) {
      case "super-admin":
        return "Super Admins";
      case "admin":
        return "Admins";
      case "shipping-manager":
        return "Shipping Managers";
      case "customer":
        return "Customers";
      default:
        return "All Users";
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/admin/users", {
        params: {
          page,
          limit: 10,
          search,
          role,
          status,
        },
      });

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch(globalSearchQuery);
    setPage(1);
  }, [globalSearchQuery]);

  useEffect(() => {
    setRole(preselectedRole || "all");
    setPage(1);
    setStatus("all");
  }, [preselectedRole]);

  useEffect(() => {
    getUsers();
  }, [page, search, role, status]);

  const handleSearchChange = (value) => {
    setSearch(value);
    dispatch(setSearchQueryRedux(value));
    setPage(1);
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <Box >
      {/* Header */}
      <Box >
        <Typography variant="h4" fontWeight={700}>
          {getTitle()}
        </Typography>
      </Box>

      {/* Search, Filters & Add Button */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-end", md: "center" }}
        mb={4}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <UserSearch
            search={search}
            setSearch={handleSearchChange}
          />

          <UserFilters
            role={role}
            setRole={handleRoleChange}
            status={status}
            setStatus={handleStatusChange}
            hideRoleFilter={!!preselectedRole}
          />
        </Stack>

        {preselectedRole !== "customer" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard/users/add"
            sx={{
              height: 40,
              px: 3,
              whiteSpace: "nowrap",
            }}
          >
            Add User
          </Button>
        )}
      </Stack>

      {/* Users Table */}
      <Box sx={{ mt: 1, pt: 1 }}>
      <UserTable
        users={users}
        loading={loading}
        onRefresh={getUsers}
        
      />
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box mt={3}>
          <UserPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default AllUsers;