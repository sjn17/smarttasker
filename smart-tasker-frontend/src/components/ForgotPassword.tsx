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
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default"
            py={4}
            px={2}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 3, sm: 4 },
                    width: '100%', 
                    maxWidth: 400,
                    borderRadius: 2,
                    boxSizing: 'border-box',
                    mt: 2
                }}
            >
                <Typography variant="h5" component="h1" align="center" fontWeight="bold" mb={1}>
                    Forgot Password
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                    Enter your username and email to receive a password reset link
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        autoFocus
                        margin="normal"
                        required
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
                        size="small"
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        size="large"
                        disabled={loading}
                        sx={{ 
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    
                    {(message || error) && (
                        <Box sx={{ mt: 2 }}>
                            {message && (
                                <Alert 
                                    severity="success" 
                                    sx={{ 
                                        mb: 2,
                                        '& .MuiAlert-message': {
                                            width: '100%',
                                            textAlign: 'center'
                                        }
                                    }}
                                >
                                    {message}
                                </Alert>
                            )}
                            {error && (
                                <Alert 
                                    severity="error"
                                    sx={{ 
                                        '& .MuiAlert-message': {
                                            width: '100%',
                                            textAlign: 'center'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
