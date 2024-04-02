# Webpack5 + React 配置开发服务器 & 处理 JS 文件

## 前言

在配置开发环境时，设置开发服务器是一个必要的步骤，它能够提供一个便捷的开发环境，使开发者能够实时预览应用的变化，并且能够处理模块热替换等功能，提高开发效率。

同时，Webpack 也能够处理 JavaScript 文件，包括转译 JSX、ES6+ 语法，以及代码分割、压缩等功能，使得项目在生产环境下能够更加高效地加载和执行。

### 处理 js 文件

```
pnpm i babel-loader @babel/core @babel/preset-react
```

@babel/core 是 Babel 的核心模块，用于将新版 JavaScript 编译为旧版 JavaScript。

@babel/preset-react 是 Babel 的预设插件，用于识别和编译 React 代码。

babel-loader 是 webpack 的加载器，用于在打包过程中通过 Babel 处理 JavaScript 文件。

#### module -> rules 添加对 jsx 和 js 文件的处理

```js
{
  // 正则表达式匹配文件路径，以 .js 或 .jsx 结尾的文件
  test: /\.jsx?$/,
  // 排除 node_modules 目录下的文件
  exclude: /node_modules/,
  // 使用 babel-loader 进行处理
  use: {
    loader: "babel-loader",
    options: {
      // 预设使用 @babel/preset-react 进行转换
      presets: ["@babel/preset-react"],
    },
  },
},
```

#### terser-webpack-plugin 插件压缩 js 文件

`terser-webpack-plugin` 是 webpack 的内置插件，无需额外安装

optimization -> minimizer 添加

```js
/* 优化配置，用于控制 webpack 打包输出的优化行为 */
optimization: {
  minimize: isProduction, // 是否进行代码压缩，取决于是否为生产环境
  minimizer: [
    // 使用 TerserWebpackPlugin 插件来压缩 JavaScript 文件
    new TerserWebpackPlugin(),
  ],
},
```

### 开发服务器配置

```
pnpm i webpack-dev-server
```

配置以下内容

```js
/* 开发服务器 */
devServer: {
  host: "localhost", // 设置服务器的主机名
  compress: true, // 是否启用 gzip 压缩
  port: 8080, // 设置端口号，默认是 8080
  hot: true, // 启用热模块替换
  open: true, // 是否在启动后自动打开浏览器
  historyApiFallback: true, // 开启 HTML5 History API 时，任意的 404 响应都会被替代为 index.html
  // liveReload: false, // 禁用浏览器自动刷新功能
},
```

