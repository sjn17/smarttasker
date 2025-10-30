import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ isLoggedIn, setIsLoggedIn }: HeaderProps) {
  const navigate = useNavigate();
  return (
     <AppBar position="static" sx={{ bgcolor: "#222" }}>
      <Toolbar sx={{ maxWidth: 800, width: "100%", mx: "auto", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ letterSpacing: 2, color: "#fff" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>SmartTasker</Link>
        </Typography>
        <Box>
          {!isLoggedIn && (
            <>
              <Button component={Link} to="/login" sx={{ color: "#ffd700" }}>Login</Button>
              <Button component={Link} to="/register" sx={{ color: "#ffd700" }}>Sign Up</Button>
              <Button component={Link} to="/forgot-password" sx={{ color: "#ffd700" }}>Forgot Password?</Button>
            </>
          )}
          {isLoggedIn && (
            <>
              <Button component={Link} to="/" sx={{ color: "#ffd700" }}>Tasks</Button>
              <Button component={Link} to="/completed" sx={{ color: "#ffd700" }}>Completed</Button>
              <Button component={Link} to="/profile" sx={{ color: "#ffd700" }}>Profile</Button>
              <Button component={Link} to="/change-password" sx={{ color: "#ffd700" }}>Reset Password</Button>
              <Button variant="contained" sx={{ bgcolor: "#444", color: "#fff", ml: 2 }}
                onClick={async () => {
                  await fetch("/api/logout", { method: "POST", credentials: "include" });
                  setIsLoggedIn(false);
                  navigate("/login");
                }}
              >Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
