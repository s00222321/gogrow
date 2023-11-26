import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Articles from "./components/Articles";
import Article from "./components/Article";
import Plants from "./components/Plants";
import Plant from "./components/Plant"; // Import the Plant component
import Forum from "./components/Forum/Forum";
import ForumPost from "./components/Forum/ForumPost";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route index element={<Register />} />
          <Route path="articles" element={<Articles />} />
          <Route path="article" element={<Article />} />
          <Route path="article/:article_id" element={<Articles />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="plants" element={<Plants />} />
          <Route path="plant/:plant_id" element={<Plant />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/:post_id" element={<ForumPost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
