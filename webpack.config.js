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
