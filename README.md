# Webpack5 + React 处理样式资源

## 前言

webpack 默认都不能处理样式资源、字体图标、图片资源、html 资源等，所以我们要加载配置来编译这些资源

### 处理前端样式

#### 处理 css 文件

```
pnpm i css-loader style-loader   
```

css-loader：用于加载 CSS 文件，并解析其中的 @import 和 url() 等语句。它会将 CSS 文件转换为 JavaScript 模块，并将 CSS 样式嵌入到 JavaScript 中，以便在应用程序运行时可以动态加载。

style-loader：用于将 CSS 样式以 `<style>` 标签的形式插入到 HTML 页面中。

#### 处理 less 文件

```
pnpm i less-loader
```

less-loader：用于加载并转换 Less 文件为 CSS 文件。

#### 处理 scss、sass 文件

```
pnpm i sass sass-loader
```

sass-loader 和 sass：用于加载并编译 Sass 或 Scss 文件为 CSS 文件。

#### 处理 Styl 文件

```
pnpm i stylus-loader
```

stylus-loader：用于加载并编译 Stylus 文件为 CSS 文件。

#### 修改 webpack.config.js 配置文件

只需在 module -> rules 中添加对应的规则

```js
{
  // 用来匹配 .css 结尾的文件
  test: /\.css$/,
  // use 数组里面 Loader 执行顺序是从右到左
  use: ["style-loader", "css-loader"],
},
{
  test: /\.less$/,
  use: ["style-loader", "css-loader", 'less-loader'],
},
{
  test: /\.s(a|c)ss$/,
  use: ["style-loader", "css-loader", 'sass-loader'],
},
{
  test: /\.styl$/,
  use: ["style-loader", "css-loader", 'stylus-loader'],
}
```
### 提取 css 成单独的文件

目前 Css 样式代码最终会被写入 Bundle 文件，并在运行时通过 style 标签注入到页面

将 JS、CSS 代码合并进同一个产物文件的方式有几个问题：

* JS、CSS 资源无法并行加载，从而降低页面性能，这样对于网站来说，会出现闪屏现象，用户体验不好

* 资源缓存粒度变大，JS、CSS 任意一种变更都会致使缓存失效。

我们应该是单独的 Css 文件，将样式代码抽离成单独的 CSS 文件，通过 link 标签加载性能才好

生产环境中只需将用 `mini-css-extract-plugin` 插件替代 `style-loader`

```
pnpm i cross-env
pnpm i mini-css-extract-plugin
```

```js
{ use: [isProduction ? MiniCssExtractPlugin.loader: "style-loader", 'css-loader'] }
```

### Css 兼容性处理

```
pnpm i postcss-loader
pnpm i postcss-preset-env
```
Cross-env：跨平台设置环境变量的命令行工具，用于在不同操作系统下设置环境变量。

MiniCssExtractPlugin：用于将 CSS 提取到单独的文件中，适用于生产环境的构建过程。

```js
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
```


module -> rules 合并代码
```js
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
```

### Css 压缩 

CssMinimizerWebpackPlugin：用于在生产环境下压缩和优化 CSS 文件。

```
pnpm i css-minimizer-webpack-plugin
```

plugins 中添加

```js
// 如果是生产环境，使用 MiniCssExtractPlugin 插件提取 CSS 到单独文件
isProduction &&
  new MiniCssExtractPlugin({
    filename: "static/css/[name].[contenthash:10].css",
    chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
  }),
```

optimization 中添加

```js
/* 优化配置，用于控制 webpack 打包输出的优化行为 */
optimization: {
  minimize: isProduction, // 是否进行代码压缩，取决于是否为生产环境
  minimizer: [new CssMinimizerWebpackPlugin()], // 使用 CssMinimizerWebpackPlugin 插件来压缩 CSS 文件
},
```