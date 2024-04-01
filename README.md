# Webpack5 + React 处理图片、字体等资源

## 前言

webpack 默认都不能处理样式资源、字体图标、图片资源、html 资源等，所以我们要加载配置来编译这些资源

### 处理图片资源

#### 在 module -> rules 添加对图片资源的处理

```js
{
  // 检查文件是否为图片类型（png、jpeg、jpg、gif、webp、svg）
  test: /\.(png|jpe?g|gif|webp|svg)$/,
  // 使用 "asset" 类型处理图片文件
  type: "asset",
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
    filename: "static/imgs/[name].[hash:8][ext][query]",
  }
}
```

asset/resource：将资源作为单独的文件输出，并导出 URL。适用于较大的资源文件，如图片、字体等。

asset/inline：将资源转换为 data URI，并导出为 data URI。适用于较小的资源文件，如 SVG 图片。

asset/source：将资源作为字符串导出。适用于将资源文件的源代码作为字符串导出，如文本文件。

asset：通用类型，webpack 会自动选择 asset/resource 或 asset/inline，取决于资源文件的大小。如果资源文件大小小于指定阈值（默认为 8kb），则会使用 asset/inline，否则会使用 asset/resource。

#### 使用 `image-webpack-loader` 压缩图片

```js
// 使用 image-webpack-loader 处理图片
use: [
  {
    loader: "image-webpack-loader",
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
```
### 处理字体图标以及其他资源

在 module -> rules 添加

```js
{
  // 匹配字体文件（ttf、woff、woff2）和视频文件（avi）的正则表达式
  test: /\.(ttf|woff2?|map4|map3|avi)$/,
  // 指定模块的类型为 'asset/resource'，表示将资源作为单独的文件输出，并导出 URL
  type: 'asset/resource',
  // 生成器配置，用于指定输出文件的名称和路径
  generator: {
    filename: 'static/media/[name].[hash:8][ext][query]',
  },
}
```

output 添加文件的输出路径，以及构建之前清理输出目录

```js
/* 输出文件 */
output: {
  // 指定输出路径为当前目录下的 build 目录
  path: isProduction ? path.resolve(__dirname, "build") : undefined,
  // 定义 asset 文件的输出路径和名称模板
  assetModuleFilename: 'static/media/[name].[hash:8][ext][query]',
  // 是否在每次构建前清理输出目录
  clean: true
},
```

