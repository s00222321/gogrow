import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Articles from "./components/Articles";
import Article from "./components/Article";
import UserDetails from "./components/UserDetails";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Articles />} />
          <Route path="article/:article_id" element={<Article />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          {/* Add the UserDetails route */}
          <Route path="userdetails" element={<UserDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
