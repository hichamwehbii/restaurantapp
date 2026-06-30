import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("waiter");

  const navigate = useNavigate(); // ✅ FIX ADDED

  async function handleRegister() {
    try {
      await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
        role,
      });

      alert("User created successfully!");

      // ✅ REDIRECT TO LOGIN PAGE
      navigate("/");
    } catch (error) {
      alert("Error registering user");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Button
  variant="outlined"
  startIcon={<ArrowBackIcon />}
  sx={{ mb: 2 }}
  onClick={() => navigate(-1)}
>
  Back
</Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4">Register User</Typography>

        <TextField
          fullWidth
          label="Name"
          sx={{ mt: 2 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Email"
          sx={{ mt: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          sx={{ mt: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          select
          fullWidth
          label="Role"
          sx={{ mt: 2 }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="waiter">Waiter</MenuItem>
          <MenuItem value="chef">Chef</MenuItem>
        </TextField>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}

export default RegisterPage;