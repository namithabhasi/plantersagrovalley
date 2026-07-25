import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import UserSearch from "../../../COMPONENTS/admin/users/UserSearch";
import UserFilters from "../../../COMPONENTS/admin/users/UserFilters";
import UserTable from "../../../COMPONENTS/admin/users/UserTable";
import UserPagination from "../../../COMPONENTS/admin/users/UserPagination";
import axios from "../../../api/axiosInstance";

const AllUsers = ({ preselectedRole }) => {
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
    getUsers();
  }, [page, search, role, status]);

  const handleSearchChange = (value) => {
    setSearch(value);
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          {getTitle()}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/dashboard/users/add"
        >
          Add User
        </Button>
      </Stack>

      {/* Search & Filters */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        mb={3}
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

      {/* Users Table */}
      <UserTable
        users={users}
        loading={loading}
        onRefresh={getUsers}
      />

      {/* Pagination */}
      <Box mt={3}>
        <UserPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      </Box>
    </Box>
  );
};

export default AllUsers;