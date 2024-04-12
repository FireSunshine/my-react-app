# Webpack 提升打包构建速度

## 前言

随着项目复杂度的增加，Webpack的构建时间可能会显著增加，为了提高开发效率和用户体验，优化Webpack的构建速度和性能成为至关重要的任务。

### cache 缓存

Webpack 的缓存机制是指在构建过程中对已经构建过的模块进行缓存，以便在下一次构建时能够复用这些模块。

Webpack5 会将首次构建出的 Module、Chunk、ModuleGraph 等对象序列化后保存到硬盘中，后面再运行的时候，就可以跳过许多耗时的编译动作，直接复用缓存数据。从而显著提高Webpack的构建速度，特别是在大型项目中。

仅仅需要在 Webpack5 中设置 `cache.type = 'filesystem'` 即可开启

```js
module.exports = {
  //...
  cache: {
    type: 'filesystem',
  },
  //...
};
```

[但是在 webpack 中默认情况下不启用持久缓存](https://github.com/webpack/changelog-v5/blob/master/guides/persistent-caching.md)

webpack also needs to invalidate cache entries:

when you npm upgrade a loader or plugin

when you change your configuration

when you change a file that is being read in the configuration

when you npm upgrade a dependency that is used in the configuration

when you pass different command-line arguments to your build script

when you have a custom build script and change that

webpack 无法在开箱后处理所有这些情况。这就是为什么 webpack 选择了安全的方式，将持久缓存作为一项选择性功能。

### thread-loader 多进程打包

```
pnpm i thread-loader
```

thread-loader 可以通过将工作任务分配给多个工作线程来提高构建性能

**需要注意**，每个 worker 都是一个单独的 node.js 进程，其开销约为600毫秒，还有进程间通信的开销。所以仅在特别耗时的操作中使用，**特别适用于耗时的 loader 操作**。

通过配置 module.rules 来实现

```js
{
  test: /\.ts$/,
  use: [
    'thread-loader',
    'ts-loader'
  ]
},
```

为了防止启动工作进程时出现高延迟，thread-loader 提供了 warmup 方法，用于预热 worker 池，以减少启动 worker 的延迟时间。预热 worker 池可以通过加载指定的模块到 Node.js 模块缓存中来实现。

```js
const threadLoader = require('thread-loader');

// 定义worker池的配置
const threadLoaderOptions = {
  workers: 2, // 工作线程数
  workerParallelJobs: 50, // 每个工作线程处理的作业数
  poolRespawn: false, // 是否重新生成工作线程池
  poolTimeout: 2000, // 空闲工作线程被杀死的超时时间
  poolParallelJobs: 50, // 工作线程分配的作业数
  name: 'my-pool', // 工作线程池的名称
};

// 预热worker池，加载指定的模块到Node.js模块缓存中
threadLoader.warmup(threadLoaderOptions, [
  'babel-loader', // 加载babel-loader模块到Node.js模块缓存中
  'sass-loader', // 加载sass-loader模块到Node.js模块缓存中
  // 可以根据需要加载其他模块
]);
```

terser-webpack-plugin 插件用于压缩 JavaScript 文件，已默认开启**并行压缩**，开发者也可以通过 parallel 参数设置具体的并发进程数量

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // 默认值为 `require('os').cpus().length - 1`
        parallel: 2, // number | boolean
      }),
    ],
  },
};
```

### 约束 Loader 执行范围

开发时我们需要使用第三方的库或插件，所有文件都下载到 node_modules 中了。而这些文件是不需要编译可以直接使用的。

所以我们在对 js 文件处理时，要排除 node_modules 下面的文件。

include 包含，只处理 xxx 文件

exclude 排除，除了 xxx 文件以外其他文件都处理

```js
module.exports = {
  module: {
    rules: [
      {
        // 正则表达式匹配文件路径，以 .js、.jsx、.ts、.tsx 结尾的文件
        test: /\.(ts|js)x?$/,
        // 排除 node_modules 目录下的文件
        // include: path.resolve(__dirname, "../src"), // 也可以用包含
        exclude: /node_modules/,
        // 使用 ts-loader 进行处理
        use: 'ts-loader',
      },
    ],
  },
};
```

### 使用 noParse 跳过文件编译

noParse: 这个选项用于告诉 Webpack，某些模块不需要进行解析。这对于一些大型的第三方库或者已经编译过的模块来说是很有用的，因为这些模块本身已经是完整的，不需要再被 Webpack 处理。

```js
module.exports = {
  //...
  module: {
    noParse: /lodash|jquery/,
  },
};
```

### 设置 resolve 缩小搜索范

类似于 Node 模块搜索逻辑，当 Webpack 遇到 import 'lodash' 这样的 npm 包导入语句时，会先尝试在当前项目 node_modules 目录搜索资源，如果找不到，则按目录层级尝试逐级向上查找 node_modules 目录，如果依然找不到，则最终尝试在全局 node_modules 中搜索。

减少模块搜索范围: 通过指定 modules 选项，可以告诉 Webpack 只在指定的目录中搜索模块，而不是遍历整个 node_modules 目录。这样可以加快模块的查找速度。

```js
resolve: {
  modules: [path.resolve(__dirname, 'src'), 'node_modules'],
}
```

Webpack 会遍历 resolve.extensions 项定义的后缀名列表，尝试在文件路径追加后缀名，搜索对应物理文件。

```js
resolve: {
  // 自动补全文件扩展名
  extensions: ['.tsx', '.ts', '.js', '.jsx'],
},
```

这意味着 Webpack 在针对不带后缀名的引入语句时，可能需要执行四次判断逻辑才能完成文件搜索，针对这种情况，可行的优化措施包括：

- 修改 resolve.extensions 配置项，减少匹配次数；

- 代码中尽量补齐文件后缀名；

- 设置 resolve.enforceExtension = true ，强制要求开发者提供明确的模块后缀名，不过这种做法侵入性太强，不太推荐

### 跳过 TS 类型检查

类型检查涉及 AST 解析、遍历以及其它非常消耗 CPU 的操作，会给工程化流程带来比较大的性能负担，因此我们可以选择关闭 ts-loader 的类型检查功能：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 设置为“仅编译”，关闭类型检查
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
```

可以借助编辑器的 TypeScript 插件实现代码检查；

使用 `fork-ts-checker-webpack-plugin` 插件将类型检查能力剥离到 子进程 执行，例如：

```js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // fork 出子进程，专门用于执行类型检查
    new ForkTsCheckerWebpackPlugin(),
  ],
};
```
