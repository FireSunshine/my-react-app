import React from "react";
import Home from "./pages/Home.jsx";
import About from "./pages/about/About.jsx";
import gifImg from "./assets/images/react.gif";
import jpegImg from "./assets/images/react.jpeg";
import jpgImg from "./assets/images/react.jpg";
import pngImg from "./assets/images/react.png";
import svgImg from "./assets/images/react.svg";
import webpImg from "./assets/images/react.webp";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <table className="table">
        <tbody>
          <tr>
            <td>gif: </td>
            <td>
              <img src={gifImg} alt="" />
            </td>
          </tr>
          <tr>
            <td>jpeg: </td>
            <td>
              <img src={jpegImg} alt="" />
            </td>
          </tr>
          <tr>
            <td>jpg: </td>
            <td>
              <img src={jpgImg} alt="" />
            </td>
          </tr>
          <tr>
            <td>png: </td>
            <td>
              <img src={pngImg} alt="" />
            </td>
          </tr>
          <tr>
            <td>svg: </td>
            <td>
              <img src={svgImg} alt="" />
            </td>
          </tr>
          <tr>
            <td>webp: </td>
            <td>
              <img src={webpImg} alt="" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
