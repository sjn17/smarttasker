import { useEffect, useState } from "react";
import api from "../api";
import { 
  Paper, 
  Typography, 
  Switch, 
  Button, 
  Box, 
  Alert, 
  Avatar, 
  Divider, 
  Container,
  Stack,
  FormControlLabel,
  LinearProgress
} from "@mui/material";
import { deepPurple } from '@mui/material/colors';


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

    if (loading) return <LinearProgress />;

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: { xs: 2, sm: 3, md: 4 },
                    maxWidth: 1200,
                    mx: 'auto',
                    borderRadius: 2
                }}
            >
                <Box 
                    display="flex" 
                    flexDirection={{ xs: 'column', sm: 'row' }} 
                    alignItems="center" 
                    gap={3} 
                    mb={4}
                >
                    <Avatar 
                        sx={{ 
                            width: 100, 
                            height: 100,
                            fontSize: '2.5rem',
                            bgcolor: deepPurple[500]
                        }}
                    >
                        {username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box textAlign={{ xs: 'center', sm: 'left' }}>
                        <Typography 
                            variant="h3" 
                            component="h1"
                            sx={{ 
                                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                                fontWeight: 600 
                            }}
                        >
                            {username}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {email}
                        </Typography>
                    </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box mb={4}>
                    <Typography variant="h5" mb={3} fontWeight={600}>Notification Settings</Typography>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={emailAlert} 
                                    onChange={(e) => setEmailAlert(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography>Email Notifications</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {emailAlert ? 'You will receive email notifications' : 'Email notifications are disabled'}
                                    </Typography>
                                </Box>
                            }
                            sx={{ m: 0 }}
                        />
                    </Paper>
                </Box>
                <Divider sx={{ my: 3 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box>
                        {message && <Alert severity="success" sx={{ display: 'inline-flex' }}>{message}</Alert>}
                        {error && <Alert severity="error" sx={{ display: 'inline-flex' }}>{error}</Alert>}
                    </Box>
                    <Button 
                        variant="contained" 
                        onClick={handleSave}
                        disabled={saving}
                        size="large"
                        sx={{
                            minWidth: 160,
                            '&.Mui-disabled': {
                                bgcolor: 'primary.main',
                                opacity: 0.7
                            }
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
