# Webpack 减少代码体积

## 前言

随着项目复杂度的增加，Webpack 的构建时间可能会显著增加，为了提高开发效率和用户体验，优化 Webpack 的构建速度和性能成为至关重要的任务。

## 代码分离

在 Webpack 中，代码分离（Code Splitting）是一种优化技术，用于将代码拆分成更小的块，从而实现按需加载、减少初始加载时间和提升性能。代码分离的主要方法有三种：**入口点分离**（Entry Points）、**防止重复**（Prevent Duplication）、**动态导入**（Dynamic Imports）

### 多入口

通过定义多个入口点，Webpack 会为每个入口点创建单独的 `bundle` 文件

```js
module.exports = {
  entry: {
    index: './src/index.js',
    admin: './src/admin.js',
    user: './src/user.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

### 动态导入

- 使用 `import()` 进行动态导入

- 使用 Webpack 的 `webpackChunkName` 魔法注释来给动态导入的模块命名

```js
// src/index.js
function loadModule() {
  import(/* webpackChunkName: "customModuleA" */ './moduleA.js')
    .then(module => {
      const moduleA = module.default;
      moduleA();
    })
    .catch(err => {
      console.error('Failed to load moduleA:', err);
    });
}

document.getElementById('loadButton').addEventListener('click', loadModule);
```

### 防止重复（Prevent Duplication）

使用 **optimization.splitChunks** 选项来防止重复，并将共享模块提取到单独的文件中，用于配置如何拆分代码块以优化加载性能和减少重复加载的模块

**配置 splitChunks**

`chunks`

- **作用**: 指定哪些类型的代码块将被优化。

- **可选值**:

  - `'all'`: 优化所有类型的代码块（包括入口块和异步块）。
  - `'async'`: 只优化异步加载的代码块。
  - `'initial'`: 只优化入口块。

`minSize` 和 `maxSize`

- **`minSize` 的作用**: 设置生成的块的最小大小（以字节为单位）。小于此大小的块不会被拆分。
- **`maxSize` 的作用**: 设置生成的块的最大大小（以字节为单位）。超过此大小的块会被尝试再次拆分。

`minChunks`

- **作用**: 一个块最少被引用的次数才会被拆分。

`maxAsyncRequests` 和 `maxInitialRequests`

- **`maxAsyncRequests` 的作用**: 设置按需加载时的最大并行请求数。
- **`maxInitialRequests` 的作用**: 设置入口点的最大并行请求数。

`automaticNameDelimiter`

- **作用**: 在生成名称时使用的连接符，默认是 `~`。

`enforceSizeThreshold`

- **作用**: 强制执行拆分的大小阈值。超过此大小的块会强制拆分。

`cacheGroups`

- **作用**: 配置缓存组，进一步控制拆分和打包的逻辑。

- **每个 `cacheGroups` 配置项包括**:

  - **`test`**: 一个正则表达式，用于匹配需要打包的模块路径。
  - **`name`**: 生成的块的名称。
  - **`priority`**: 缓存组的优先级，数值越大优先级越高。
  - **`minChunks`**: 一个块最少被引用的次数才会被拆分。
  - **`reuseExistingChunk`**: 允许复用已经存在的块，减少重复打包。

```js
/* 优化配置，用于控制 webpack 打包输出的优化行为 */
optimization: {
  // 用于控制生成块（chunk）的 ID 的方式
  chunkIds: isProduction ? 'deterministic' : 'named',
  // 提取runtime文件, 将 hash 值单独保管在一个 runtime 文件中
  runtimeChunk: {
    // 将模块加载和解析的逻辑提取到名为 runtime~entrypoint-name 的文件中，例如 runtime~main.js
    name: entrypoint => `runtime~${entrypoint.name}.js`,
  },
  splitChunks: {
    chunks: 'all', // 选择哪些块进行优化。值可以是 'all', 'async', 和 'initial'
    minSize: 20000, // 生成块的最小大小（以字节为单位）
    maxSize: 30000, // 生成块的最大大小（以字节为单位）
    minChunks: 1, // 在分割之前，这个代码块最少被引用的次数
    maxAsyncRequests: 30, // 按需加载时的最大并行请求数
    maxInitialRequests: 30, // 入口点的最大并行请求数
    automaticNameDelimiter: '~', // 生成名称时的连接符
    enforceSizeThreshold: 50000, // 强制执行分割的大小阈值
    cacheGroups: {
      // react react-dom react-router-dom 一起打包成一个js文件
      react: {
        test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
        name: 'chunk-react',
        priority: 40, // 权重 优先级
      },
      // antd 单独打包
      antd: {
        test: /[\\/]node_modules[\\/]antd[\\/]/,
        name: 'chunk-antd',
        priority: 30,
      },
      // 剩下的node_modules单独打包
      libs: {
        test: /[\\/]node_modules[\\/]/,
        name: 'chunk-libs',
        priority: 20,
        minChunks: 1, // 代码块最少被引用的次数
        reuseExistingChunk: true, // 允许复用已经存在的块
      },
    },
  },
}
```

**chunkIds**

`chunkIds` 用于指定生成块（chunk）的 ID 的方式。

- `deterministic` 会根据模块内容生成短而稳定的 ID，适合于生产环境，有利于长期缓存和文件大小的稳定性。
- `named` 会使用模块的名称作为 ID，适合于开发环境，方便调试和阅读。

**runtimeChunk**

`runtimeChunk` 用于配置如何生成 runtime 文件，用于将 runtime 文件（包含模块加载和解析逻辑的代码）提取出来。

## Prefetch 和 Preload

在声明 import 时，使用下面这些内置指令，来告知浏览器

- `prefetch` (预获取)：将来某些导航下可能需要的资源

- `preload` (预加载)：当前导航下可能需要资源

与 prefetch 指令相比，preload 指令有许多不同之处：

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。

## CDN

- 购买 CDN 服务器；
- 我们可以直接修改 `publicPath`，在打包时添加上 CDN 地址

```js
output: {
  // 设置所有资源的基础路径，如：'https://cdn.example.com/'
  publicPath: 'https://cdn.example.com/',
},
```

## 压缩代码

### 压缩 Js

Terser 是目前最流行的 ES6 代码压缩工具之一，它支持一系列代码压缩功能，如 DCE（Dead-code elimination 死代码消除）、删除注释、删除空格、代码合并和变量名简化等。

从 Webpack 5.0 开始，默认使用 `Terser` 作为 JavaScript 代码压缩器，不需要安装，开箱即用。通过设置 `optimization.minimize` 选项为 `true` 即可启用压缩功能：

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

- extractComments：默认值为 true，表示会将注释抽取到一个单独的文件中；
  - 在开发中，我们不希望保留这个注释时，可以设置为 false；
- parallel：使用多进程并发运行提高构建的速度，默认值是 true
  - 并发运行的默认数量： os.cpus().length - 1；
  - 我们也可以设置自己的个数，但是使用默认值即可；
- terserOptions：terser 相关的配置
  - compress：设置压缩相关的选项；
  - mangle：设置丑化相关的选项，可以直接设置为 true；
  - toplevel：顶层变量是否进行转换；
  - keep_classnames：保留类的名称；
  - keep_fnames：保留函数的名称；

### 压缩 Css

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

### 压缩 Html

使用 `mode = 'production'`，生产模式构建时，默认开启 Html 压缩。

HtmlWebpackPlugin 插件生成 HTML 的模板，其他的配置：

- title: 指定生成的 HTML 文件的标题。
- filename: 指定生成的 HTML 文件的名称，默认为 `index.html`。
- template: 指定一个 HTML 文件模板，插件会在这个模板的基础上生成最终的 HTML 文件。
- inject: 指定注入位置，可以是 `'head'`、`'body'` 或 `false`，默认是 `'body'`。
- favicon: 指定网站的 favicon 图标路径。
- meta: 添加 meta 标签。
- minify: 是否对生成的 HTML 文件进行压缩，默认会使用一个插件html-minifier-terser
- cache：设置为true，只有当文件改变时，才会生成新的文件（默认值也是true）
- hash: 是否在打包生成的 JavaScript 文件后面加上哈希值，用于缓存控制

### 压缩图片

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

## Tree-shaking 删除无用模块导出

Tree Shaking 是指通过静态分析代码的方式，识别和移除未被使用的代码，以减少最终打包文件的大小。它通常与 ES6 模块系统（例如 import 和 export 语句）一起使用。

### usedExports

在 Webpack 中，启动 Tree Shaking 功能必须同时满足以下：

- 使用 ESM 规范编写模块代码；

- Webpack 已经默认开启了这个功能，或者配置 optimization.usedExports 为 true，启动标记功能；

- 启动代码优化功能，可以通过如下方式实现：

  配置 mode = production；

  配置 optimization.minimize = true；

  提供 optimization.minimizer 数组。

**Webpack 中，Tree-shaking 的实现**：

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

### sideEffects

在 package.json 中配置 `sideEffects`，直接对模块进行优化；

- `false` 表示该包中的**所有模块都没有副作用**，意味着可以安全地进行树摇优化，**整个文件不参与打包**。
- `true` 表示该包中的所有模块都有副作用，不进行树摇优化。
- 数组形式：指定有副作用的文件列表，未在列表中的文件将进行树摇优化

```json
{
  "sideEffects": ["*.css", "*.scss", "./src/some-special-file.js"]
}
```

### CSS 实现 Tree Shaking

使用 `PurgeCss` 插件

## Scope Hoisting

作用域提升（Scope Hoisting）是一种优化技术，通过减少代码体积和加快浏览器加载速度来提高打包性能。它的核心思想是通过将所有模块的代码放在一个或少数几个函数中，来减少模块的包装开销。

```js
const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};
```

优点

- 减少代码体积：通过减少模块包装的开销，最终的打包文件会更小。
- 提升运行性能：减少了运行时加载模块的开销，提高了加载速度。
- 改善作用域链：共享的作用域使得作用域链更加扁平，提升了访问变量的性能。
