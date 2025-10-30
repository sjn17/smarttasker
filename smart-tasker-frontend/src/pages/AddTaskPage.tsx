import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    Button, 
    Alert,
    Container
} from "@mui/material";
import api from "../api";

export default function AddTaskPage() {
    const [taskName, setTaskName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(30);
    const [notes, setNotes] = useState("");
    const [priority, setPriority] = useState(3);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/task", {
                task_name: taskName,
                date,
                time,
                duration,
                notes,
                priority,
                completed: 0
            });
            navigate("/tasks")
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add task");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    mt: 4,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom>
                    Add New Task
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    <TextField
                        label="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                    
                    <TextField
                        label="Duration (minutes)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        fullWidth
                        margin="normal"
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                    
                    <TextField
                        label="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    
                    <TextField
                        label="Priority"
                        type="number"
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                        fullWidth
                        margin="normal"
                        InputProps={{ inputProps: { min: 1, max: 5 } }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/tasks')}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            color="primary"
                        >
                            Add Task
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
