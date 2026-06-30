import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LogoutButton from "./LogoutButton";

function TableOrderPage() {
  const { tableId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [paidMoney, setPaidMoney] = useState("");

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

  const change = Number(paidMoney) - getTotal();

  async function finishPayment() {
    if (!order) return;

    if (Number(paidMoney) < getTotal()) {
      alert("Not enough money.");
      return;
    }

    await axios.put(
      `http://localhost:5000/api/orders/${order._id}`,
      {
        status: "Served",
      }
    );

    localStorage.removeItem(`table-${tableId}`);

    alert(`Payment completed.\nChange: $${change}`);

    navigate("/tables");
  }

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
          onClick={() => navigate("/tables")}
        >
          Back
        </Button>

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

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate("/tables")}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        Table {tableId}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">
          Current Order
        </Typography>

        <Divider sx={{ my: 2 }} />

        {order.items.map((item: any, index: number) => (
          <Typography key={index} sx={{ mb: 1 }}>
            {item.name} × {item.quantity} = $
            {item.price * item.quantity}
          </Typography>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5">
          Total: ${getTotal()}
        </Typography>

        <TextField
          fullWidth
          type="number"
          label="Money Received"
          value={paidMoney}
          sx={{ mt: 3 }}
          onChange={(e) => setPaidMoney(e.target.value)}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Change: ${change > 0 ? change : 0}
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