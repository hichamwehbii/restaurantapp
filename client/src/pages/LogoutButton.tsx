import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    // Remove saved login information
    localStorage.removeItem("role");

    // If you also save name, token, email, etc.
    localStorage.removeItem("name");
    localStorage.removeItem("token");

    // Go back to login page
    navigate("/");
  }

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;