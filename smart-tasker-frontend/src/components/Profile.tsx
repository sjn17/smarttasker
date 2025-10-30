import { useEffect, useState } from "react";
import api from "../api";
import { Paper, Typography, Switch, Button, Box, Alert } from "@mui/material";


export default function Profile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailAlert, setEmailAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/profile")
            .then(res => {
                setUsername(res.data.username);
                setEmail(res.data.email);
                setEmailAlert(res.data.email_alert);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load profile");
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            await api.put("/profile", { email_alert: emailAlert });
            setMessage("Profile updated!");
        } catch {
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
            <Paper elevation={3} sx={{ p: 4, minWidth: 360 }}>
                <Typography variant="h5" mb={2}>Profile</Typography>
                <Typography><b>Username:</b> {username}</Typography>
                <Typography mb={1}><b>Email:</b> {email}</Typography>
                <Box display="flex" alignItems="center" mt={2}>
                    <Switch checked={emailAlert} onChange={e => { setEmailAlert(e.target.checked); setMessage(""); }} />
                    <Typography>Receive email alerts/reminders</Typography>
                </Box>
                <Button
                    variant="contained"
                    disabled={saving}
                    onClick={handleSave}
                    sx={{ mt: 2 }}
                >
                    {saving ? "Saving..." : "Save"}
                </Button>
                {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
        </Box>
    );
}
