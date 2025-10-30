import { useState } from "react";
import api from "../api";
import { Paper, Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.post("/signup", { username, password, email });
      setMessage("Registration successful! You can now log in.");
      setUsername("");
      setPassword("");
      setEmail("");
    } catch (err: any) {
      // Optional: customize based on error response
      setError("Registration failed: " + (err.response?.data?.message || "Please try again."));
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={4} sx={{ p: 4, width: 340 }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
}
