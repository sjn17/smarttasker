import { useState } from "react";
import api from "../api";
import { Paper, Typography, TextField, Button, Box, Alert } from "@mui/material";

interface Props {
    onTaskAdded: () => void;
}

export default function TaskForm({ onTaskAdded }: Props) {
    const [taskName, setTaskName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(30);
    const [notes, setNotes] = useState("");
    const [priority, setPriority] = useState(5);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/task", {
                task_name: taskName,
                date,
                time,
                duration,
                notes,
                priority
            });
            setTaskName("");
            setDate("");
            setTime("");
            setDuration(30);
            setNotes("");
            setPriority(5);
            onTaskAdded();
        } catch {
            setError("Failed to add task");
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
            <Paper elevation={2} sx={{ p: 3, width: 350 }}>
                <Typography variant="h6" gutterBottom>Add New Task</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Task Name" value={taskName} onChange={e => setTaskName(e.target.value)} fullWidth margin="normal" required />
                    <TextField type="date" label="Due Date" value={date} onChange={e => setDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
                    <TextField type="time" label="Time" value={time} onChange={e => setTime(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
                    <TextField type="number" label="Duration (minutes)" value={duration} onChange={e => setDuration(Number(e.target.value))} fullWidth margin="normal" required />
                    <TextField type="number" label="Priority (1=highest)" value={priority} onChange={e => setPriority(Number(e.target.value))} fullWidth margin="normal" required />
                    <TextField label="Notes" value={notes} onChange={e => setNotes(e.target.value)} fullWidth margin="normal" multiline rows={2} />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Add</Button>
                </form>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
        </Box>
    );
}
