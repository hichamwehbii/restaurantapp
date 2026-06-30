import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import LogoutButton from "./LogoutButton";

function TableOrderPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);

  async function loadOrder() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders"
      );

      const tableOrder = response.data.find(
        (o: any) =>
          String(o.tableId) === String(tableId) &&
          o.status !== "Served"
      );

      setOrder(tableOrder);
    } catch {
      alert("Cannot load order");
    }
  }

  useEffect(() => {
    loadOrder();
  }, []);

  function getTotal() {
    if (!order) return 0;

    return order.items.reduce(
      (sum: number, item: any) =>
        sum + item.price * item.quantity,
      0
    );
  }

  async function finishPayment() {
    if (!order) return;

    await axios.put(
      `http://localhost:5000/api/orders/${order._id}`,
      {
        status: "Served",
      }
    );

    localStorage.removeItem(`table-${tableId}`);

    alert("Payment completed");

    navigate("/tables");
  }

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">
          No active order for Table {tableId}
        </Typography>

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate(`/menu/${tableId}`)}
        >
          Create Order
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <LogoutButton />

      <Typography variant="h4" gutterBottom>
        Table {tableId}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">
          Current Order
        </Typography>

        <Divider sx={{ my: 2 }} />

        {order.items.map((item: any, index: number) => (
          <Typography key={index}>
            {item.name} × {item.quantity}
            {"  "}
            ${item.price * item.quantity}
          </Typography>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5">
          Total: ${getTotal()}
        </Typography>

        <Button
          sx={{ mt: 3, mr: 2 }}
          variant="contained"
          onClick={() => navigate(`/menu/${tableId}`)}
        >
          Add More Items
        </Button>

        <Button
          sx={{ mt: 3 }}
          color="success"
          variant="contained"
          onClick={finishPayment}
        >
          Finish Payment
        </Button>
      </Paper>
    </Container>
  );
}

export default TableOrderPage;