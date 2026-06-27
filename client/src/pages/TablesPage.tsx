import { Container, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../pages/LogoutButton";

function TablesPage() {
  const navigate = useNavigate();

  const tables = [1, 2, 3, 4, 5, 6];

  return (
    <Container sx={{ mt: 4 }}>
      <LogoutButton />
      <Typography variant="h4" gutterBottom>
        Restaurant Tables
      </Typography>

      <Grid container spacing={2}>
        {tables.map((table) => (
          <Grid size={{ xs: 6, md: 4 }} key={table}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/menu/${table}`)}
            >
              <Typography variant="h5">
                Table {table}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default TablesPage;