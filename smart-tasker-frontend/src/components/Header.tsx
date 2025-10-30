import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  onLogout: () => void;
}

function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#222" }}>
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ letterSpacing: 2, color: "#fff" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>SmartTasker</Link>
        </Typography>
        
        <Box>
          <Button component={Link} to="/tasks" sx={{ color: "#ffd700" }}>Tasks</Button>
          <Button component={Link} to="/completed-tasks" sx={{ color: "#ffd700" }}>Completed</Button>
          <Button component={Link} to="/profile" sx={{ color: "#ffd700" }}>Profile</Button>
          <Button 
            onClick={handleLogout}
            sx={{ color: "#ffd700" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
