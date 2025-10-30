import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Box, 
  IconButton, 
  InputAdornment
} from "@mui/material";
import { Lock as LockIcon, Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
    onLogin: () => void;
}

export default function Login({ onLogin }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const response = await api.post("/login", { username, password });
            localStorage.setItem("token", response.data.token);
            onLogin();
            navigate("/tasks");
        } catch (err: any) {
            setError(err.response?.data?.error || "Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                p: { xs: 2, sm: 3 },
                overflow: 'auto'
            }}
        >
            <Paper 
                elevation={6}
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    minWidth: 300,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    my: 'auto',
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box 
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 3,
                        textAlign: 'center'
                    }}
                >
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: 'primary.dark',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                        }}
                    >
                        <LockIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Sign in to continue to SmartTasker
                    </Typography>
                </Box>
                
                <Box sx={{ 
                    p: { xs: 3, sm: 4 },
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                
                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        noValidate 
                        sx={{ 
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1 1 auto',
                            '& > *:last-child': {
                                mt: 'auto',
                                pt: 2
                            }
                        }}
                    >
                        <TextField
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                            autoFocus
                            margin="normal"
                            required
                            variant="outlined"
                            size="medium"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                mb: 2
                            }}
                        />
                        <TextField
                            label="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            size="medium"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                                mb: 1
                            }}
                        />
                        
                        <Box sx={{ textAlign: 'right', mb: 3 }}>
                            <Button 
                                color="primary" 
                                size="small"
                                onClick={() => navigate('/forgot-password')}
                                sx={{ textTransform: 'none' }}
                            >
                                Forgot Password?
                            </Button>
                        </Box>
                        
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            size="large"
                            disabled={isLoading}
                            sx={{ 
                                mt: 1,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                letterSpacing: 0.5,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3,
                                    bgcolor: 'primary.dark'
                                },
                                '&.Mui-disabled': {
                                    bgcolor: 'primary.main',
                                    opacity: 0.8
                                }
                            }}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Button 
                                    color="primary" 
                                    size="small"
                                    onClick={() => navigate('/register')}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    Sign up
                                </Button>
                            </Typography>
                        </Box>
                        
                        {error && (
                            <Alert 
                                severity="error"
                                sx={{ 
                                    mt: 3,
                                    borderRadius: 2,
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
