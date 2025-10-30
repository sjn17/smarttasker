import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper, Box, Typography, TextField, Button,
  Alert, CircularProgress, IconButton, InputAdornment
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

interface RegisterProps {
  onRegister: (username: string, password: string, email: string) => Promise<void>;
}

export default function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onRegister(username, password, email);
      navigate("/tasks");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        p: 1,
        overflow: "auto",
        zIndex: 1200,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 370,
          minWidth: 260,
          maxHeight: "94vh",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 7px 20px rgba(0,0,0,0.10)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "primary.dark",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1,
            }}
          >
            <PersonIcon fontSize="medium" />
          </Box>
          <Typography variant="h5" component="h1" fontWeight={600} gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.88 }}>
            Join SmartTasker and boost your productivity
          </Typography>
        </Box>

        {/* Form Section */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.3,
              "& > *:last-child": {
                mt: 1,
                pt: 1,
              },
            }}
          >
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              autoFocus
              margin="none"
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              fullWidth
              margin="none"
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="none"
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              margin="none"
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                letterSpacing: 0.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                  bgcolor: "primary.dark",
                },
                "&.Mui-disabled": {
                  bgcolor: "primary.main",
                  opacity: 0.8,
                  transform: "none",
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={23} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    width: "100%",
                  },
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
