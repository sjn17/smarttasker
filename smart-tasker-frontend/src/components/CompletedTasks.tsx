import { useEffect, useState } from "react";
import api from "../api";
import type { Task } from "./TaskList";

export default function CompletedTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data.filter((t: Task) => t.completed === 1)))
      .catch(() => setError("Failed to load completed tasks"));
  }, []);

  return (
    <div>
      <h2>Completed Tasks</h2>
      {error && <div style={{color:"red"}}>{error}</div>}
      <ul>
        {tasks.length === 0 && <li>No completed tasks!</li>}
        {tasks.map(task =>
          <li key={task.id}>
            {task.task_name} | {task.date} {task.time}
            {/* Could add details/notes/priority here */}
          </li>
        )}
      </ul>
    </div>
  );
}
