# Webpack 减少代码体积

## 前言

随着项目复杂度的增加，Webpack 的构建时间可能会显著增加，为了提高开发效率和用户体验，优化 Webpack 的构建速度和性能成为至关重要的任务。

### 压缩代码

#### 压缩 Js

Terser 是目前最流行的 ES6 代码压缩工具之一，它支持一系列代码压缩功能，如 DCE（Dead-code elimination 死代码消除）、删除注释、删除空格、代码合并和变量名简化等。

从 Webpack 5.0 开始，默认使用 Terser 作为 JavaScript 代码压缩器，不需要安装，开箱即用。通过设置 optimization.minimize 选项为 true 即可启用压缩功能：

```js
module.exports = {
  //...
  optimization: {
    minimize: true,
  },
};
```

使用 `mode = 'production'`，生产模式构建时，默认开启 Terser 压缩。

也可以手动创建 [terser-webpack-plugin](https://www.npmjs.com/package/terser-webpack-plugin#options) 实例并传入压缩配置实现更精细的压缩功能

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 默认值为 `require('os').cpus().length - 1`
        parallel: 2, // number | boolean
        // ...
      }),
    ],
  },
};
```

#### 压缩 Css

使用 [css-minimizer-webpack-plugin](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/) 插件对 css 压缩

```js
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      // 使用 CssMinimizerWebpackPlugin 插件来压缩 CSS 文件
      new CssMinimizerWebpackPlugin(),
    ],
  },
};
```

#### 压缩 Html

使用 `mode = 'production'`，生产模式构建时，默认开启 Html 压缩。

#### 压缩图片

社区中有很多处理图片的插件，比如 `image-webpack-loader`、[image-minimizer-webpack-plugin](https://github.com/webpack-contrib/image-minimizer-webpack-plugin/)

```
pnpm install image-minimizer-webpack-plugin imagemin --save-dev

无损压缩
pnpm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo --save-dev
```

```js
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
};
```

### Tree-shaking 删除无用模块导出

Tree Shaking 是指通过静态分析代码的方式，识别和移除未被使用的代码，以减少最终打包文件的大小。它通常与 ES6 模块系统（例如 import 和 export 语句）一起使用。

在 Webpack 中，启动 Tree Shaking 功能必须同时满足以下：

- 使用 ESM 规范编写模块代码；

- Webpack 已经默认开启了这个功能，或者配置 optimization.usedExports 为 true，启动标记功能；

- 启动代码优化功能，可以通过如下方式实现：

  配置 mode = production；

  配置 optimization.minimize = true；

  提供 optimization.minimizer 数组。

Webpack 中，Tree-shaking 的实现：

- 一是需要先 「标记」 出模块导出值中哪些没有被用过

  标记功能需要配置 `optimization.usedExports = true` 开启；

- 二是使用代码压缩插件 —— 如 Terser 删掉这些没被用到的导出变量。

```js
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  //...
  optimization: {
    minimize: true
    minimizer: [
      new TerserWebpackPlugin({
        // 默认值为 `require('os').cpus().length - 1`
        parallel: 2, // number | boolean
      }),
    ],
    usedExports: true,
  }
};
```
