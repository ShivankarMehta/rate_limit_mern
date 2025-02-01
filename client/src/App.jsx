import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./register";
import Login from "./Login";
import Data from "./Data";

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/register">Register</Link> | 
        <Link to="/data">Data</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/data" element={<Data />} />
        <Route path="/" element={<h1>Welcome to Rate Limited MERN App</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
