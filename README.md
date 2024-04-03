# Webpack5 + React + TS

## 前言

在搭建了 Webpack5 + React + JavaScript 的项目之后，接下来进一步完善这个项目，集成 TypeScript。

TypeScript 作为 JavaScript 的超集，提供了静态类型检查的功能，大大减少了代码中的错误，并提高了代码的可读性和可维护性。

###  使用 `@babel/preset-typescript`

@babel/preset-typescript 是 Babel 的一个预设，用于在 Babel 中支持 TypeScript。如果项目中已经使用 babel-loader，可以选择使用 @babel/preset-typescript 规则集，借助 babel-loader 完成 JavaScript 与 TypeScript 的转码工作，但是 @babel/preset-typescript 只是简单完成代码转换，**跳过了类型检查步骤**，构建时没有类型安全性。


```
pnpm i @babel/preset-typescript
```

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        // 正则表达式匹配文件路径，以 .js、.jsx、.ts、.tsx 结尾的文件
        test: /\.(ts|js)x?$/,
        // 排除 node_modules 目录下的文件
        exclude: /node_modules/,
        // 使用 babel-loader 进行处理
        use: {
          loader: "babel-loader",
          options: {
            // 预设使用 @babel/preset-react 和 @babel/preset-typescript 进行转换
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
      },
    ],
  },
};
```

### 使用 `ts-loader`

```
pnpm i ts-loader @types/react @types/react-dom
```

ts-loader：ts-loader 是 webpack 的一个加载器，用于在 webpack 构建过程中编译 TypeScript 文件。它允许您在 webpack 中使用 TypeScript，并在构建时将 TypeScript 文件转换为 JavaScript。**它的优点是具有构建时的类型安全性，但缺点是编译速度可能较慢。**

@types/react 和 @types/react-dom：这两个包是 TypeScript 的类型定义文件，用于提供 React 和 React-DOM 库的类型定义。

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        // 正则表达式匹配文件路径，以 .js、.jsx、.ts、.tsx 结尾的文件
        test: /\.(ts|js)x?$/,
        // 排除 node_modules 目录下的文件
        exclude: /node_modules/,
        // 使用 ts-loader 进行处理
        use: "ts-loader",
      },
    ],
  },
};
```

执行 `npx tsc --init` 生成 tsconfig.json 文件， 并添加以下内容


```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Language and Environment */
    "target": "es5", // 目标 ECMAScript 版本
    "jsx": "react-jsx", // 指定 JSX 语法转换器

    /* Modules */
    "module": "commonjs", // 指定模块代码生成方式
    "baseUrl": "./src", // 设置相对路径的基准文件夹
    "paths": {
      "@/*": ["*"] // 定义路径别名，方便引入自定义模块
    },
    "resolveJsonModule": true, // 允许将 JSON 文件作为模块导入

    /* JavaScript Support */
    "allowJs": true, // 允许编译 JavaScript 文件
    "outDir": "./build", // 输出目录

    /* Interop Constraints */
    "esModuleInterop": true, // 启用模块间的 ES 模块兼容性
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致

    /* Type Checking */
    "strict": true, // 启用所有严格类型检查选项

    /* Completeness */
    "skipLibCheck": true // 跳过引入文件的类型检查
  }
}
```

extensions: 引入模块时自动解析的文件扩展名。Webpack 将自动尝试解析 ".ts"、".tsx"、".js" 和 ".jsx" 这些文件扩展名的模块。这样做可以使得在 import 模块时不需要指定文件的具体扩展名，提高开发效率。

alias: 为模块路径设置别名 @ 。使用 @ 来代替 "src" 目录的绝对路径。例如，通过 `import "@/components/Header"` 来引入 `"src/components/Header"` 目录下的组件。


```js
resolve: {
  // 自动补全文件扩展名
  extensions: [".ts", ".tsx", ".js", ".jsx"],
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
},
```

另外为了解析图片的类型声明，新建 images.d.ts

```ts
declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}
```

