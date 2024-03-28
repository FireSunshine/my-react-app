import React from "react";
import Home from "./pages/Home.jsx";
import About from "./pages/about/About.jsx";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      Hello React
      <Home />
      <About />
    </div>
  );
};

export default App;
