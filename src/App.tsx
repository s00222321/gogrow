import React from "react";
import Register from "./components/Register";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <Register />
    </div>
  );
};

export default App;
