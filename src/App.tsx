import Home from "@/pages/Home";
import About from "@/pages/about/About";
import gifImg from "@/assets/images/react.gif";
import jpegImg from "@/assets/images/react.jpeg";
import jpgImg from "@/assets/images/react.jpg";
import pngImg from "@/assets/images/react.png";
import svgImg from "@/assets/images/react.svg";
import webpImg from "@/assets/images/react.webp";
import "@/assets/styles/iconfont.css";
import "./App.css";
import { add } from "./utils/add";
import { subtract } from "./utils/subtract";
import data from './utils/test.json'

interface UserProps {
  name: string;
  age: number;
  sex: boolean;
  des: "";
}

const App = () => {
  const use: UserProps = { name: "sunshine", age: 18, sex: false, des: "" };
  return (
    <div className="app">
      <div className="fonts">
        <div className="font1">
          {add()} {subtract()} {data.name}
        </div>
        <div className="font1">{use.name}</div>
        <div className="font1">使用字体图标</div>
        <div className="font2">使用字体图标</div>
      </div>
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
      <Home />
      <About />
    </div>
  );
};

export default App;
