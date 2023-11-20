import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Articles from "./components/Articles";
import Article from "./components/Article";
import Forum from "./components/Forum/Forum";
import ForumPost from "./components/Forum/ForumPost";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route index element={<Forum />} />
          <Route path="article" element={<Article />} />
          <Route path="article/:article_id" element={<Articles />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/:post_id" element={<ForumPost />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
