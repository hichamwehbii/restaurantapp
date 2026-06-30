import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, Box } from "@mui/material";
import LogoutButton from "../pages/LogoutButton";

function AdminDashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // 🔒 protect page
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  function logout() {
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Button
  variant="outlined"
  startIcon={<ArrowBackIcon />}
  sx={{ mb: 2 }}
  onClick={() => navigate(-1)}
>
  Back
</Button>
        <LogoutButton />
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          👨‍💼 Admin Dashboard
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome Admin! Manage your restaurant system here.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Button variant="contained" onClick={() => navigate("/tables")}>
            Manage Tables
          </Button>

          <Button variant="contained" onClick={() => navigate("/menu/1")}>
            Manage Menu
          </Button>

          <Button variant="contained" onClick={() => navigate("/kitchen")}>
            Kitchen View
          </Button>

          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminDashboard;