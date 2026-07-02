import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
};

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

function MenuPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        setMenu(response.data.filter((item: MenuItem) => item.available));
      } catch {
        alert("Failed to load menu");
      }
    }

    fetchMenu();
  }, []);

  function addItem(item: MenuItem) {
    const existingItem = orderItems.find(
      (orderItem) => orderItem.name === item.name
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.name === item.name
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
              }
            : orderItem
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  }

  async function submitOrder() {
    if (orderItems.length === 0) {
      alert("Please add items first");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        tableId,
        items: orderItems,
      });

      localStorage.setItem(`table-${tableId}`, "occupied");

      alert("Order sent to kitchen");

      setOrderItems([]);

      navigate(`/table/${tableId}`);
    } catch {
      alert("Failed to send order");
    }
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Typography variant="h4">Table {tableId}</Typography>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {menu.map((item) => (
          <Card key={item._id}>
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>

              <Typography color="text.secondary">{item.category}</Typography>

              <Typography>${item.price}</Typography>

              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => addItem(item)}
              >
                Add
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Current Order
      </Typography>

      {orderItems.map((item) => (
        <Typography key={item.name}>
          {item.name} x {item.quantity}
        </Typography>
      ))}

      <Typography variant="h5" sx={{ mt: 2 }}>
        Total: ${total}
      </Typography>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2 }}
        onClick={submitOrder}
      >
        Send To Kitchen
      </Button>
    </Container>
  );
}

export default MenuPage;
