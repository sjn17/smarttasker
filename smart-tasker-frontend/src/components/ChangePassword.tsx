import { useState } from "react";
import api from "../api";
import { AxiosError } from "axios";
import { Box, Paper, Typography, TextField, Button, Alert } from "@mui/material";

export default function ChangePassword() {
    const [oldpw, setOldpw] = useState("");
    const [newpw, setNewpw] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMsg(""); setErr("");
        try {
            await api.post("/reset_password", {
                old_password: oldpw,
                new_password: newpw
            });
            setMsg("Password successfully changed!");
            setOldpw(""); setNewpw("");
        } catch (err: unknown) {
            const error = err as AxiosError<{ error: string }>;
            setErr(error.response?.data?.error || "Update failed");
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
                    Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" mb={3}>
                    Create a new secure password for your account
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        type="password"
                        label="Current Password"
                        value={oldpw}
                        onChange={e => setOldpw(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
                        size="small"
                        autoComplete="current-password"
                    />
                    <TextField
                        type="password"
                        label="New Password"
                        value={newpw}
                        onChange={e => setNewpw(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        variant="outlined"
                        size="small"
                        autoComplete="new-password"
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
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                    
                    {(msg || err) && (
                        <Box sx={{ mt: 2 }}>
                            {msg && (
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
                                    {msg}
                                </Alert>
                            )}
                            {err && (
                                <Alert 
                                    severity="error"
                                    sx={{ 
                                        '& .MuiAlert-message': {
                                            width: '100%',
                                            textAlign: 'center'
                                        }
                                    }}
                                >
                                    {err}
                                </Alert>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
