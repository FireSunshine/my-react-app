// 引入 Node.js 的 path 模块，用于处理文件路径
const path = require("path");
// 引入 HtmlWebpackPlugin 插件，用于生成 HTML 文件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 引入 MiniCssExtractPlugin 插件，用于提取 CSS 到单独的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 引入 CssMinimizerWebpackPlugin 插件，用于压缩 CSS 文件
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

// 判断当前环境是否为生产环境
const isProduction = process.env.NODE_ENV === "production";

// 获取样式加载器的函数，根据当前环境动态返回加载器配置
const getStyleLoaders = (loader) => {
  return [
    // 如果是生产环境，则使用 MiniCssExtractPlugin.loader 提取 CSS 到单独文件，否则使用 style-loader 将样式注入到 DOM 中
    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
    "css-loader", // 用于解析 CSS 文件
    {
      loader: "postcss-loader", // 使用 PostCSS 处理 CSS
      options: {
        postcssOptions: {
          plugins: [
            [
              "postcss-preset-env", // 使用预设配置来处理 CSS，例如自动添加浏览器前缀
              {
                autoprefixer: {
                  flexbox: "no-2009",
                },
                stage: 3,
              },
            ],
          ],
        },
      },
    },
    loader, // 根据传入的 loader 参数添加相应的预处理器，例如 less-loader、sass-loader 等
  ].filter(Boolean); // 过滤掉数组中的空值
};

// 导出 webpack 的配置对象
module.exports = {
  /* 模式 */
  mode: isProduction ? "production" : "development",

  /* 入口文件 */
  entry: path.join(__dirname, "src", "index.js"), // 指定入口文件路径为 src 目录下的 index.js

  /* 输出文件 */
  output: {
    // 指定输出路径为当前目录下的 build 目录
    path: isProduction ? path.resolve(__dirname, "build") : undefined,
  },

  /* 模块配置，定义对不同类型文件的处理规则 */
  module: {
    // 定义规则数组
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: getStyleLoaders(), // 使用 getStyleLoaders 函数获取样式加载器配置
      },
      {
        // 匹配 .less 结尾的文件
        test: /\.less$/,
        // 使用 less-loader 处理 Less 文件
        use: getStyleLoaders("less-loader"),
      },
      {
        // 匹配 .sass 或 .scss 结尾的文件
        test: /\.s(a|c)ss$/,
        // 使用 sass-loader 处理 Sass/SCSS 文件
        use: getStyleLoaders("sass-loader"),
      },
      {
        // 匹配 .styl 结尾的文件
        test: /\.styl$/,
        // 使用 stylus-loader 处理 Stylus 文件
        use: getStyleLoaders("stylus-loader"),
      },
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
    // 如果是生产环境，使用 MiniCssExtractPlugin 插件提取 CSS 到单独文件
    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
  ],

  /* 优化配置，用于控制 webpack 打包输出的优化行为 */
  optimization: {
    minimize: isProduction, // 是否进行代码压缩，取决于是否为生产环境
    minimizer: [new CssMinimizerWebpackPlugin()], // 使用 CssMinimizerWebpackPlugin 插件来压缩 CSS 文件
  },
};
