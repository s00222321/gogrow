import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Articles from "./components/Articles/Articles";
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
import Leaderboard from "./components/Leaderboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";
import Article from "./components/Articles/Article";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route index element={<Register />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          
          {/* Private routes */}
          <Route
            path="mygarden"
            element={
              <PrivateRoute>
                <MyGarden />
              </PrivateRoute>
            }
          />
          <Route
            path="home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="plants"
            element={
              <PrivateRoute>
                <Plants />
              </PrivateRoute>
            }
          />
          <Route
            path="userdetails"
            element={
              <PrivateRoute>
                <UserDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="plant/:plant_id"
            element={
              <PrivateRoute>
                <Plant />
              </PrivateRoute>
            }
          />
          <Route
            path="forum"
            element={
              <PrivateRoute>
                <Forum/>
              </PrivateRoute>
            }
          />
          <Route
            path="articles"
            element={
              <PrivateRoute>
                <Articles/>
              </PrivateRoute>
            }
          />
          <Route path="article/:article_id"
           element={
           <Article />
           } />
          <Route
            path="forum/:post_id"
            element={
              <PrivateRoute>
                <ForumPost />
              </PrivateRoute>
            }
          />
          <Route
            path="sensors"
            element={
              <PrivateRoute>
                <SensorDisplay />
              </PrivateRoute>
            }
          />
          <Route
            path="leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <Toaster position="bottom-center" />
      <Footer />
    </Router>
  );
};

export default App;