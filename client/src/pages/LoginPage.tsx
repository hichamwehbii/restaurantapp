import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password,
        }
      );

      const role = response.data.role;

      // ✅ SAVE ROLE (important for frontend protection)
      localStorage.setItem("role", role);

      alert(`Welcome ${response.data.name}`);

      // ✅ ROLE-BASED NAVIGATION
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "waiter") {
        navigate("/tables");
      } else if (role === "chef") {
        navigate("/kitchen");
      } else {
        alert("Unknown role");
      }

    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Cannot connect to server");
      }
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lebanese Restaurant Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default LoginPage;