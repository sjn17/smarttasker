import { useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import api from "./api";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import Register from "./components/Register";
import CompletedTasks from "./components/CompletedTasks";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import Header from "./components/Header";
import AddTaskPage from "./pages/AddTaskPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/tasks");
  };

  const handleRegister = async (username: string, password: string, email: string) => {
    try {
      // Call the registration API
      await api.post("/signup", { username, password, email });
      // If registration is successful, log the user in
      const loginResponse = await api.post("/login", { username, password });
      localStorage.setItem("token", loginResponse.data.token);
      setIsLoggedIn(true);
      navigate("/tasks");
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error; // This will be caught by the Register component
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="App">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/tasks" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/tasks" replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isLoggedIn ? (
                <Navigate to="/tasks" replace />
              ) : (
                <ForgotPassword />
              )
            }
          />
          <Route
            path="/change-password"
            element={
              isLoggedIn ? (
                <ChangePassword />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              isLoggedIn ? <TaskList /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/tasks/add"
            element={
              isLoggedIn ? <AddTaskPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/completed-tasks"
            element={
              isLoggedIn ? <CompletedTasks /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <Profile /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
