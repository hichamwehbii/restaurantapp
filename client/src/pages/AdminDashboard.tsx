import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import LogoutButton from "../pages/LogoutButton";

type RestaurantMenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const categories = ["Main Dish", "Sandwich", "Salad", "Drink", "Dessert"];

  const [menuItems, setMenuItems] = useState<RestaurantMenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [navigate, role]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const response = await axios.get("http://localhost:5000/api/menu");
      setMenuItems(response.data);
    } catch {
      alert("Failed to load menu items");
    }
  }

  async function addMenuItem() {
    if (!name || !price || !category) {
      alert("Please fill all menu item fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/menu", {
        name,
        price: Number(price),
        category,
        available,
      });

      setName("");
      setPrice("");
      setCategory("");
      setAvailable(true);
      await fetchMenuItems();
      alert("Menu item added");
    } catch {
      alert("Failed to add menu item");
    }
  }

  function logout() {
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
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
          Admin Dashboard
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome Admin! Manage your restaurant system here.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="contained" onClick={() => navigate("/tables")}>
            Manage Tables
          </Button>

          <Button variant="contained" onClick={() => navigate("/menu/1")}>
            View Menu
          </Button>

          <Button variant="contained" onClick={() => navigate("/kitchen")}>
            Kitchen View
          </Button>

          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Add Menu Item
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Item name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />

          <TextField
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((categoryOption) => (
              <MenuItem key={categoryOption} value={categoryOption}>
                {categoryOption}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={available}
                onChange={(event) => setAvailable(event.target.checked)}
              />
            }
            label="Available"
          />

          <Button variant="contained" onClick={addMenuItem}>
            Add To Menu
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Current Menu
        </Typography>

        <Stack spacing={1}>
          {menuItems.map((item) => (
            <Box
              key={item._id}
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Typography>
                {item.name} - {item.category}
              </Typography>
              <Typography>
                ${item.price} {item.available ? "" : "(Unavailable)"}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}

export default AdminDashboard;
