import { useState } from "react";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import Register from "./components/Register";
import CompletedTasks from "./components/CompletedTasks";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// Main App
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/");  
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isLoggedIn
              ? <TaskList />
              : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/completed"
          element={
            isLoggedIn
              ? <CompletedTasks />
              : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn
              ? <Profile />
              : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/change-password"
          element={
            isLoggedIn
              ? <ChangePassword />
              : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
