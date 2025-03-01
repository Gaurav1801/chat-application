import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import "./App.css";
import Chats from "./Components/Chats";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/chats" element={<Chats />} />

      </Routes>
    </Router>
  );
}

export default App;
