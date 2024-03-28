import React from "react";
import "./index.less";
import "./index.sass";
import "./index.scss";
import './index.styl'

const Home = () => {
  return (
    <>
      <div className="box">
        <p>home page -- less</p>
      </div>
      <div className="box1">
        <p>home page -- sass</p>
      </div>
      <div className="box2">
        <p>home page -- scss</p>
      </div>
      <div className="box3">
        <p>home page -- styl</p>
      </div>
    </>
  );
};

export default Home;
