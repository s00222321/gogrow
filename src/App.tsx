import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Articles from "./components/Articles";
import Article from "./components/Article";
import Plants from "./components/Plants";
import Plant from "./components/Plant"; // Import the Plant component

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route index element={<Articles />} />
          <Route path="article/:article_id" element={<Article />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="plants" element={<Plants />} />
          <Route path="plant/:plant_id" element={<Plant />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
