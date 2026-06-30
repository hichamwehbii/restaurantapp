import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../pages/LogoutButton";

function TablesPage() {
  const navigate = useNavigate();
  const tables = [1, 2, 3, 4, 5, 6];

  const [orders, setOrders] = useState<any[]>([]);

  async function loadOrders() {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch {
      console.log("Cannot load table status");
    }
  }

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  function getTableOrder(table: number) {
    return orders.find(
      (order) =>
        String(order.tableId) === String(table) &&
        order.status !== "Served"
    );
  }

  function getLocalStatus(table: number) {
    return localStorage.getItem(`table-${table}`);
  }

  async function markServed(orderId: string, table: number) {
    await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
      status: "Served",
    });

    localStorage.removeItem(`table-${table}`);

    loadOrders();
  }

  return (
    <Container sx={{ mt: 4 }}>
      <LogoutButton />

      <Typography variant="h4" gutterBottom>
        Waiter Tables
      </Typography>

      <Grid container spacing={2}>
        {tables.map((table) => {
          const order = getTableOrder(table);
          const localStatus = getLocalStatus(table);

          const isOccupied = Boolean(order) || localStatus === "occupied";
          const isReady = order?.status === "Ready";

          return (
            <Grid size={{ xs: 6, md: 4 }} key={table}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isReady
                    ? "#2196f3"
                    : isOccupied
                    ? "#f44336"
                    : "#4caf50",
                  color: "white",
                  borderRadius: 3,
                }}
                onClick={() => navigate(`/menu/${table}`)}
              >
                <Typography variant="h5">Table {table}</Typography>

                <Chip
                  label={
                    isReady
                      ? "Ready - Take it"
                      : isOccupied
                      ? order?.status || "Occupied"
                      : "Free"
                  }
                  sx={{
                    mt: 2,
                    backgroundColor: "white",
                    color: "black",
                  }}
                />

                {isReady && order && (
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      markServed(order._id, table);
                    }}
                  >
                    Served
                  </Button>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default TablesPage;