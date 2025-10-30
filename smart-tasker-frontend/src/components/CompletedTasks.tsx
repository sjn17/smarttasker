import { useEffect, useState } from "react";
import api from "../api";
import type { Task } from "./TaskList";
import { Box, Paper, Typography, List, ListItem, ListItemText, Alert } from "@mui/material";

export default function CompletedTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        api.get("/tasks")
            .then(res => setTasks(res.data.filter((t: Task) => t.completed === 1)))
            .catch(() => setError("Failed to load completed tasks"));
    }, []);

    return (
        <Box maxWidth={600} mx="auto" mt={5}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" mb={2}>Completed Tasks</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <List>
                    {tasks.length === 0 && <ListItem><ListItemText primary="No completed tasks!" /></ListItem>}
                    {tasks.map(task =>
                        <ListItem key={task.id} divider>
                            <ListItemText
                                primary={task.task_name}
                                secondary={`${task.date} ${task.time}`}
                            />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
}
