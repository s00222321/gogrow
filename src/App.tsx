import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Login />
    </div>
  );
};

export default App;
