import { useState } from "react";
import api from "../api";
import { AxiosError } from "axios";
import { Paper, Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); setError(""); setMessage("");
        try {
            await api.post("/forgot_password", { username, email });
            setMessage("Password reset email sent. Please check your inbox!");
            setUsername(""); setEmail("");
        } catch (err: unknown) {
            const error = err as AxiosError<{ error: string }>;
            setError(error.response?.data?.error || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Paper elevation={4} sx={{ p: 4, width: 340 }}>
                <Typography variant="h5" gutterBottom>Forgot Password</Typography>
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
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                        {loading ? "Processing..." : "Send reset mail"}
                    </Button>
                </form>
                {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
        </Box>
    );
}
