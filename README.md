# Webpack5 + React 配置 React 应用程序

## 前言

使用 Webpack5 + React 从 0 到 1 构建 React 应用程序

**拓展：**

  技术栈：Webpack5 + React18 + TS...

  代码风格：eslint + prettier + husky + Git hooks...

  资源文件：样式、图片、字体...

  优化功能：热更新、资源压缩、代码分离、缓存...

### 搭建 React 开发环境

```
mkdir my-react-app
cd my-react-app
pnpm init
```

#### 项目目录

```
my-react-app
├── webpack.config.js
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   └── index.html
└── src
    ├── App.jsx
    └── index.js
```
#### 安装 react 和 react-dom

```
pnpm install react react-dom
```

#### src/App.jsx

```jsx
import React from "react";

const App = () => {
  return <div>Hello React</div>;
};

export default App;

```

#### src/index.js

```js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);

```

#### public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MY-React-APP</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```

#### 安装项目所需的依赖

```
pnpm install webpack webpack-cli
```

webpack 是一个模块打包工具，用于将应用程序的各个模块打包成一个或多个bundle文件。

webpack-cli 是 webpack 的命令行接口，用于在命令行中运行 webpack 相关命令。

```
pnpm install @babel/core @babel/preset-env @babel/preset-react babel-loader
```

@babel/core 是 Babel 的核心模块，用于将新版 JavaScript 编译为旧版 JavaScript。

@babel/preset-env 是 Babel 的预设插件，用于将 ES6+ 版本的 JavaScript 编译为 ES5 标准兼容的 JavaScript。

@babel/preset-react 是 Babel 的预设插件，用于识别和编译 React 代码。

babel-loader 是 webpack 的加载器，用于在打包过程中通过 Babel 处理 JavaScript 文件。

```
pnpm install html-webpack-plugin webpack-dev-server
```

html-webpack-plugin 自动生成一个 HTML 文件，以便为 webpack 创建的 JavaScript bundle 提供服务。

webpack-dev-server 开发服务器，用于在开发过程中提供服务，并支持热重载等功能。

#### 配置 webpack.config.js

```js
// 引入 Node.js 的 path 模块，用于处理文件路径
const path = require("path");
// 引入 HtmlWebpackPlugin 插件，用于生成 HTML 文件
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 导出 webpack 的配置对象
module.exports = {
  /* 模式 */
  mode: "development",

  /* 入口文件 */
  entry: path.join(__dirname, "src", "index.js"), // 指定入口文件路径为 src 目录下的 index.js

  /* 输出文件 */
  output: {
    // 指定输出路径为当前目录下的 build 目录
    path: path.resolve(__dirname, "build"),
  },

  /* 模块配置，定义对不同类型文件的处理规则 */
  module: {
    // 定义规则数组
    rules: [
      {
        // 正则表达式匹配文件路径，以 .js 或 .jsx 结尾的文件
        test: /\.jsx?$/,
        // 排除 node_modules 目录下的文件
        exclude: /node_modules/,
        // 使用 babel-loader 进行处理
        use: {
          loader: "babel-loader",
          options: {
            // 预设使用 @babel/preset-env 和 @babel/preset-react 进行转换
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },

  /* 插件配置，用于扩展 webpack 功能 */
  plugins: [
    // 使用 HtmlWebpackPlugin 插件，生成 HTML 文件
    new HtmlWebpackPlugin({
      // 指定 HTML 模板文件路径为 public 目录下的 index.html
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
};

```

#### package.json 修改以下内容

```json
"scripts": {
  "dev": "webpack serve",
  "build": "webpack"
},
```
#### 运行与打包

```
pnpm run dev
pnpm run build
```
