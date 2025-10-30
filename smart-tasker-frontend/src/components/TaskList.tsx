import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { 
    Box, Typography, Alert, Stack, Card, CardContent, 
    Button, IconButton, TextField, Container
} from "@mui/material";
import { 
    Edit as EditIcon, 
    CheckCircle as CheckCircleIcon, 
    Delete as DeleteIcon,
    Add as AddIcon
} from "@mui/icons-material";

export interface Task {
    id: number;
    task_name: string;
    date: string;
    time: string;
    duration: number;
    notes: string;
    completed: number;
    priority: number;
    reminder_sent: boolean;
}

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Task>>({});

    const loadTasks = () => {
        api.get("/tasks")
            .then(res => setTasks(res.data.filter((t: Task) => !t.completed)))
            .catch(() => setError("Failed to load tasks"));
    };

    useEffect(() => { loadTasks(); }, []);

    const deleteTask = async (id: number) => {
        try {
            await api.delete(`/task/${id}`);
            setTasks(tasks => tasks.filter(t => t.id !== id));
        } catch {
            setError("Failed to delete task.");
        }
    };

    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">Your Tasks</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/tasks/add')}
                >
                    New Task
                </Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Stack spacing={2}>
                {tasks.map(task =>
                    <Card key={task.id} elevation={2}>
                        <CardContent>
                            {editingId === task.id ? (
                                <Box component="form"
                                    onSubmit={async e => {
                                        e.preventDefault();
                                        try {
                                            await api.put(`/task/${task.id}`, editForm);
                                            setTasks(tasks => tasks.map(t => t.id === task.id ? { ...t, ...editForm } : t));
                                            setEditingId(null);
                                            setEditForm({});
                                        } catch {
                                            setError("Failed to edit task.");
                                        }
                                    }}
                                    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
                                >
                                    <TextField value={editForm.task_name ?? task.task_name}
                                        onChange={e => setEditForm(f => ({ ...f, task_name: e.target.value }))}
                                        label="Task Name" size="small" />
                                    <TextField type="date" value={editForm.date ?? task.date}
                                        onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                                        size="small" />
                                    <TextField type="time" value={editForm.time ?? task.time}
                                        onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                                        size="small" />
                                    <Button type="submit" variant="contained" size="small">Save</Button>
                                    <Button type="button" variant="outlined" size="small" onClick={() => setEditingId(null)}>Cancel</Button>
                                </Box>
                            ) : (
                                <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                                    <Box flexGrow={1}>
                                        <Typography variant="subtitle1"><b>{task.task_name}</b></Typography>
                                        <Typography color="text.secondary">{task.date} at {task.time} | Priority {task.priority}</Typography>
                                        {task.notes && <Typography color="text.secondary">Notes: {task.notes}</Typography>}
                                    </Box>
                                    <IconButton onClick={() => { setEditingId(task.id); setEditForm(task); }} size="small"><EditIcon /></IconButton>
                                    <IconButton
                                        onClick={async () => {
                                            try {
                                                await api.post(`/task/${task.id}/complete`);
                                                setTasks(tasks => tasks.filter(t => t.id !== task.id));
                                            } catch {
                                                setError("Failed to mark task completed.");
                                            }
                                        }}
                                        color="success" size="small"
                                    ><CheckCircleIcon /></IconButton>
                                    <IconButton onClick={() => deleteTask(task.id)} color="error" size="small"><DeleteIcon /></IconButton>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Container>
    );
}
