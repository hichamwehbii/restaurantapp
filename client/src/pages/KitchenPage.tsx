import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import LogoutButton from "./LogoutButton";

function KitchenPage() {
  const [orders, setOrders] = useState<any[]>([]);

  async function loadOrders() {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch {
      alert("Cannot load orders");
    }
  }

  useEffect(() => {
    loadOrders();

    const interval = setInterval(loadOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        status,
      });

      loadOrders();
    } catch {
      alert("Failed to update order");
    }
  }

  async function deleteOrder(id: string, tableId: string) {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);

      localStorage.removeItem(`table-${tableId}`);

      loadOrders();
    } catch {
      alert("Cannot delete order");
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <LogoutButton />

      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        👨‍🍳 Kitchen Orders
      </Typography>

      {orders.length === 0 && <Typography>No orders yet.</Typography>}

      {orders.map((order) => (
        <Paper key={order._id} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6">
            🍽 Table {order.tableId}
          </Typography>

          <Chip
            label={order.status}
            color={
              order.status === "Ready"
                ? "success"
                : order.status === "Preparing"
                ? "warning"
                : "default"
            }
            sx={{ mt: 1, mb: 2 }}
          />

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle1">Order Items</Typography>

          {order.items.map((item: any, index: number) => (
            <Typography key={index}>
              • {item.name} × {item.quantity}
            </Typography>
          ))}

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => updateStatus(order._id, "Preparing")}
            >
              Preparing
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={() => updateStatus(order._id, "Ready")}
            >
              Ready
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => deleteOrder(order._id, order.tableId)}
            >
              Delete
            </Button>
          </Stack>
        </Paper>
      ))}
    </Container>
  );
}

export default KitchenPage;