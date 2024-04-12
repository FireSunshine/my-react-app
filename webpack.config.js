// 引入 Node.js 的 path 模块，用于处理文件路径
const path = require('path');
// 引入 HtmlWebpackPlugin 插件，用于生成 HTML 文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 引入 MiniCssExtractPlugin 插件，用于提取 CSS 到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 引入 CssMinimizerWebpackPlugin 插件，用于压缩 CSS 文件
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
// 引入 TerserWebpackPlugin 插件，用于压缩 JavaScript 文件
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// 判断当前环境是否为生产环境
const isProduction = process.env.NODE_ENV === 'production';

// 获取样式加载器的函数，根据当前环境动态返回加载器配置
const getStyleLoaders = loader => {
  return [
    // 如果是生产环境，则使用 MiniCssExtractPlugin.loader 提取 CSS 到单独文件，否则使用 style-loader 将样式注入到 DOM 中
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader', // 用于解析 CSS 文件
    {
      loader: 'postcss-loader', // 使用 PostCSS 处理 CSS
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-preset-env', // 使用预设配置来处理 CSS，例如自动添加浏览器前缀
              {
                autoprefixer: {
                  flexbox: 'no-2009',
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
  mode: isProduction ? 'production' : 'development',

  /* 入口文件 */
  entry: path.join(__dirname, 'src', 'index.tsx'), // 指定入口文件路径为 src 目录下的 index.js

  /* 输出文件 */
  output: {
    // 指定输出路径为当前目录下的 build 目录
    path: isProduction ? path.resolve(__dirname, 'build') : undefined,
    // 定义 asset 文件的输出路径和名称模板
    assetModuleFilename: 'static/media/[name].[hash:8][ext][query]',
    // 是否在每次构建前清理输出目录
    clean: true,
  },

  /* 模块配置，定义对不同类型文件的处理规则 */
  module: {
    noParse: /lodash|jquery/,
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
        use: getStyleLoaders('less-loader'),
      },
      {
        // 匹配 .sass 或 .scss 结尾的文件
        test: /\.s(a|c)ss$/,
        // 使用 sass-loader 处理 Sass/SCSS 文件
        use: getStyleLoaders('sass-loader'),
      },
      {
        // 匹配 .styl 结尾的文件
        test: /\.styl$/,
        // 使用 stylus-loader 处理 Stylus 文件
        use: getStyleLoaders('stylus-loader'),
      },
      {
        // 正则表达式匹配文件路径，以 .js、.jsx、.ts、.tsx 结尾的文件
        test: /\.(ts|js)x?$/,
        // 排除 node_modules 目录下的文件
        // include: path.resolve(__dirname, "../src"), // 也可以用包含
        exclude: /node_modules/,
        // 使用 ts-loader 进行处理
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        // 检查文件是否为图片类型（png、jpeg、jpg、gif、webp、svg）
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        // 使用 "asset" 类型处理图片文件
        type: 'asset',
        parser: {
          // 将图片转换为 Data URL 的条件设置
          dataUrlCondition: {
            // 设置最大大小为 16KB，小于16kb的图片会被base64处理
            maxSize: 16 * 1024,
          },
        },
        generator: {
          // 输出文件的路径和名称设置
          // 格式：static/imgs/文件名.[8位哈希值][文件扩展名][查询参数]
          filename: 'static/imgs/[name].[hash:8][ext][query]',
        },
        // 使用 image-webpack-loader 处理图片
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              // 是否禁用图片压缩处理，非生产环境下禁用
              disable: !isProduction,
              // mozjpeg 压缩选项
              mozjpeg: {
                progressive: true, // 使用渐进式压缩
              },
              // optipng 压缩选项
              optipng: {
                enabled: false, // 禁用 optipng 压缩
              },
              // pngquant 压缩选项
              pngquant: {
                quality: [0.65, 0.9], // 压缩质量范围
                speed: 4, // 压缩速度
              },
              // gifsicle 压缩选项
              gifsicle: {
                interlaced: false, // 不使用隔行扫描
              },
              // webp 压缩选项
              webp: {
                quality: 75, // webp 图片质量
              },
            },
          },
        ],
      },
      {
        // 匹配字体文件（ttf、woff、woff2）和视频文件（avi）的正则表达式
        test: /\.(ttf|woff2?|map4|map3|avi)$/,
        // 指定模块的类型为 'asset/resource'，表示将资源作为单独的文件输出，并导出 URL
        type: 'asset/resource',
        // 生成器配置，用于指定输出文件的名称和路径
        generator: {
          filename: 'static/media/[name].[hash:8][ext][query]',
        },
      },
    ],
  },

  /* 插件配置，用于扩展 webpack 功能 */
  plugins: [
    // 使用 HtmlWebpackPlugin 插件，生成 HTML 文件
    new HtmlWebpackPlugin({
      // 指定 HTML 模板文件路径为 public 目录下的 index.html
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    // 如果是生产环境，使用 MiniCssExtractPlugin 插件提取 CSS 到单独文件
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    // fork 出子进程，专门用于执行类型检查
    new ForkTsCheckerWebpackPlugin(),
  ],

  /* 优化配置，用于控制 webpack 打包输出的优化行为 */
  optimization: {
    minimize: isProduction, // 是否进行代码压缩，取决于是否为生产环境
    minimizer: [
      // 使用 CssMinimizerWebpackPlugin 插件来压缩 CSS 文件
      new CssMinimizerWebpackPlugin(),
      // 使用 TerserWebpackPlugin 插件来压缩 JavaScript 文件
      new TerserWebpackPlugin(),
    ],
  },

  cache: {
    type: 'filesystem',
  },

  /* 解析模块加载器选项 */
  resolve: {
    // 自动补全文件扩展名
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // 配置模块解析路径，首先在 'src' 目录下查找，然后再去 'node_modules' 目录查找所需的模块
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },

  /* 开发服务器 */
  devServer: {
    host: 'localhost', // 设置服务器的主机名
    compress: true, // 是否启用 gzip 压缩
    port: 8080, // 设置端口号，默认是 8080
    hot: true, // 启用热模块替换
    open: true, // 是否在启动后自动打开浏览器
    historyApiFallback: true, // 开启 HTML5 History API 时，任意的 404 响应都会被替代为 index.html
    // liveReload: false, // 禁用浏览器自动刷新功能
  },
};
