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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
            <Paper elevation={4} sx={{ p: 4, minWidth: 330 }}>
                <Typography variant="h5" mb={2}>Change Password</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="password"
                        label="Old password"
                        value={oldpw}
                        onChange={e => setOldpw(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        type="password"
                        label="New password"
                        value={newpw}
                        onChange={e => setNewpw(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </Button>
                </form>
                {msg && <Alert severity="success" sx={{ mt: 2 }}>{msg}</Alert>}
                {err && <Alert severity="error" sx={{ mt: 2 }}>{err}</Alert>}
            </Paper>
        </Box>
    );
}
