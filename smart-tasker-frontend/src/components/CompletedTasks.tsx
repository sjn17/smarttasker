import { useEffect, useState } from "react";
import api from "../api";
import type { Task } from "./TaskList";
import { 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Divider,
  Container,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CompletedTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        api.get("/tasks")
            .then(res => setTasks(res.data.filter((t: Task) => t.completed === 1)))
            .catch(() => setError("Failed to load completed tasks"));
    }, []);

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
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <CheckCircleIcon color="success" fontSize="large" />
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              fontWeight: 600 
            }}
          >
            Completed Tasks
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Stack spacing={2}>
          {tasks.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No completed tasks yet!
            </Typography>
          ) : (
            tasks.map(task => (
              <Card key={task.id} elevation={1}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircleIcon color="success" />
                    <Box flexGrow={1}>
                      <Typography variant="h6" component="div">
                        {task.task_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed on {task.date} at {task.time}
                        {task.priority > 0 && ` • Priority: ${task.priority}`}
                      </Typography>
                      {task.notes && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          Notes: {task.notes}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Paper>
    </Container>
    );
}
