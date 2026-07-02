import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
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

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <LogoutButton />
      </Box>

      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid #e6e8ef",
          boxShadow: "0 18px 45px rgba(31, 41, 55, 0.08)",
          mb: 3,
        }}
      >
        <Typography variant="overline" sx={{ color: "#c2410c", fontWeight: 700 }}>
          Restaurant Admin
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Admin Dashboard
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Manage tables, menu items, and kitchen orders from one place.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <Button variant="contained" size="large" onClick={() => navigate("/tables")}>
            Manage Tables
          </Button>

          <Button variant="contained" size="large" onClick={() => navigate("/menu/1")}>
            View Menu
          </Button>

          <Button variant="contained" size="large" onClick={() => navigate("/kitchen")}>
            Kitchen View
          </Button>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "380px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            border: "1px solid #e6e8ef",
            boxShadow: "0 12px 30px rgba(31, 41, 55, 0.06)",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Add Menu Item
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Add a new dish and choose if customers can order it today.
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

            <Button variant="contained" size="large" onClick={addMenuItem}>
              Add To Menu
            </Button>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            border: "1px solid #e6e8ef",
            boxShadow: "0 12px 30px rgba(31, 41, 55, 0.06)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Current Menu
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                {menuItems.length} items saved
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1.5}>
            {menuItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  border: "1px solid #eef0f4",
                  borderRadius: 2,
                  backgroundColor: "#fbfcfe",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.category}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontWeight: 700 }}>${item.price}</Typography>
                  <Chip
                    size="small"
                    label={item.available ? "Available" : "Hidden"}
                    color={item.available ? "success" : "default"}
                  />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default AdminDashboard;
