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
import { useParams } from "react-router-dom";

function MenuPage() {
  const { tableId } = useParams();

  const menu = [
    { name: "Shawarma", price: 8 },
    { name: "Burger", price: 7 },
    { name: "Pepsi", price: 2 },
    { name: "Tabbouleh", price: 5 },
  ];

  const [orderItems, setOrderItems] = useState<any[]>([]);

  function addItem(item: any) {
    setOrderItems([...orderItems, item]);
  }

  async function submitOrder() {
    await axios.post("http://localhost:5000/api/orders", {
      tableNumber: tableId,
      items: orderItems,
    });

    alert("Order sent to kitchen");
    setOrderItems([]);
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.price,
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