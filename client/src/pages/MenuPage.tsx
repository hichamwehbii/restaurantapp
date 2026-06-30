import { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function MenuPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const menu = [
    { name: "Shawarma", price: 8 },
    { name: "Burger", price: 7 },
    { name: "Pepsi", price: 2 },
    { name: "Tabbouleh", price: 5 },
  ];

  const [orderItems, setOrderItems] = useState<any[]>([]);

  function addItem(item: any) {
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
          ...item,
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

      // Make this table occupied
      localStorage.setItem(`table-${tableId}`, "occupied");

      alert("Order sent to kitchen");

      setOrderItems([]);

      navigate(`/table/${tableId}`);
    } catch (error) {
      alert("Failed to send order");
    }
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">
        Table {tableId}
      </Typography>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {menu.map((item) => (
          <Card key={item.name}>
            <CardContent>
              <Typography variant="h6">
                {item.name}
              </Typography>

              <Typography>
                ${item.price}
              </Typography>

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
          {item.name} × {item.quantity}
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