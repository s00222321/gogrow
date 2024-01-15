import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Articles from "./components/Articles";
import Article from "./components/Article";
import Plants from "./components/Plants";
import Plant from "./components/Plant";
import Forum from "./components/Forum/Forum";
import ForumPost from "./components/Forum/ForumPost";
import MyGarden from "./components/MyGarden";
import Home from "./components/Home";
import Footer from "./components/Footer";
import SensorDisplay from "./components/SensorsDisplay";
import UserDetails from "./components/UserDetails";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route index element={<Register />} />
          <Route path="articles" element={<Articles />} />
          <Route index element={<Articles />} />
          <Route path="article/:article_id" element={<Article />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="mygarden" element={<MyGarden />} />
          <Route path="home" element={<Home />} />
          <Route path="plants" element={<Plants />} />
          <Route path="plant/:plant_id" element={<Plant />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/:post_id" element={<ForumPost />} />
          <Route path="sensors" element={<SensorDisplay />} />
          {/* Add the UserDetails route */}
          <Route path="userdetails" element={<UserDetails />} />
        </Routes>
      </div>
      <Toaster position="bottom-center" />
      <Footer />
      {/* Commented out the snowflakes
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❅</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❄</div>
      </div>
      */}
    </Router>
  );
};

export default App;
