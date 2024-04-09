# React + TS 集成 EsLint + Prettier + Husky + Lint-Staged + Commitlint

## 前言

[EsLint](https://eslint.org/) 和 [Prettier](https://prettier.io/) 可以规范化的代码风格以及建立一套严格的代码质量检查机制。EsLint 可以帮助我们规范化代码风格；而 Prettier 则可以自动格式化我们的代码，使其保持整洁、易读。

Husky、Lint-Staged 和 Commitlint 进一步加强了代码质量管理流程。Husky 可以在 Git Hooks 中执行脚本，Lint-Staged 可以在 Git 暂存区中运行 EsLint 和 Prettier，而 Commitlint 则规范化了我们的提交信息。

### EsLint

安装 ESLint

```
pnpm i eslint
```

安装 ESLint 后，使用以下命令创建一个配置文件

```
npx eslint --init
```

这将提出一系列问题。根据您的项目要求回答这些问题

```
? How would you like to use ESLint? …
  To check syntax only
❯ To check syntax and find problems
  To check syntax, find problems, and enforce code style

✔ How would you like to use ESLint? · problems
? What type of modules does your project use? …
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
? Which framework does your project use? …
❯ React
  Vue.js
  None of these

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
? Does your project use TypeScript? › No / Yes

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
✔ Browser
✔ Node

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
? What format do you want your config file to be in? …
❯ JavaScript
  YAML
  JSON

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JavaScript
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-plugin-react@latest @typescript-eslint/parser@latest eslint@latest
? Would you like to install them now? › No / Yes

✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JavaScript
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-plugin-react@latest @typescript-eslint/parser@latest eslint@latest
✔ Would you like to install them now? · No / Yes
? Which package manager do you want to use? …
  npm
  yarn
❯ pnpm
```

通过上面的问题，将会安装以下依赖，并自动在根目录创建一个 .eslintrc.js 的文件

@typescript-eslint/eslint-plugin: 这是一个用于 TypeScript 项目的 ESLint 插件。它提供了一组规则，用于检查 TypeScript 代码中的常见问题，并提供了一些额外的功能，例如类型检查和类型推断。该插件包含了一系列可以在 TypeScript 项目中使用的 ESLint 规则。

eslint-plugin-react: 这是一个用于 React 项目的 ESLint 插件。它提供了一组规则，用于检查 React 组件的代码，并确保它们符合最佳实践和风格指南。这些规则涵盖了 JSX 语法、React 组件的命名、生命周期方法的使用等方面。

@typescript-eslint/parser: 这是一个用于解析 TypeScript 代码的 ESLint 解析器。解析器负责将 TypeScript 代码解析为抽象语法树（AST），以便 ESLint 插件和规则可以分析和处理代码。@typescript-eslint/parser 解析器专门用于解析 TypeScript 代码，以便在 TypeScript 项目中进行代码检查和规范。

.eslintrc.js 文件

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {},
};
```

只需在 rules 中添加一些配置 ESLint 规则

检查当前目录下所有文件是否符合 ESLint 规则：

```
npx eslint .
```

修复代码中的 ESLint 错误和警告

```
npx eslint --fix .
```

### Prettier

```
pnpm i prettier eslint-config-prettier eslint-plugin-prettier
```

prettier: Prettier 是一个代码格式化工具，用于自动格式化代码以符合统一的风格。

eslint-config-prettier: 这是一个 ESLint 配置，用于禁用 ESLint 中与 Prettier 冲突的格式化规则，以确保 Prettier 和 ESLint 协同工作。

eslint-plugin-prettier: 这是一个 ESLint 插件，用于在 ESLint 中运行 Prettier，并将 Prettier 的格式化结果作为 ESLint 的一部分输出。

在项目根目录新建 .prettierrc.js 文件，并添加以下内容

```js
module.exports = {
  // 一行的字符数，如果超过会进行换行，默认为 80
  printWidth: 120,
  // 一个 tab 代表几个空格数，默认为 2
  tabWidth: 2,
  // 是否使用 tab 进行缩进，默认为 false，表示用空格进行缩减
  useTabs: false,
  // 行尾是否需要分号，默认为 true
  semi: true,
  // 是否使用单引号，默认为 false，使用双引号
  singleQuote: true,
  // jsx 是否使用单引号，默认为 false，使用双引号
  jsxSingleQuote: true,
  // 末尾是否需要逗号，有三个可选值 "<none|es5|all>"
  // "<none>" 代表不需要逗号
  // "<es5>" 代表ES5中需要逗号
  // "<all>" 代表所有对象最后一个属性添加逗号
  trailingComma: 'all',
  // 对象大括号直接是否有空格，默认为 true，效果：{ foo: bar }
  bracketSpacing: true,
  // 箭头函数，只有一个参数的时候，是否需要括号，默认为 avoid，有两个可选值 "avoid" 和 "always"
  arrowParens: 'avoid',
};
```

在 .eslintrc.js 文件中 extends 添加 `plugin:prettier/recommended`

```js
"extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
],
```

在 .eslintrc.js 文件中 plugins 添加 `prettier`

```js
"plugins": [
    "@typescript-eslint",
    "react",
    "prettier"
],
```

格式化当前目录下所有文件

```
npx prettier . --write
pnpm exec prettier . --write
```

#### 更新 .eslintrc.js 配置

```js
module.exports = {
  // 定义环境
  env: { browser: true, es2021: true, node: true },

  // 指定解析器
  parser: '@typescript-eslint/parser',

  // 扩展规则
  extends: [
    'eslint:recommended', // 使用 ESLint 推荐的规则
    'plugin:@typescript-eslint/recommended', // 使用 @typescript-eslint 推荐的规则
    'plugin:react/recommended', // 使用 React 推荐的规则
    'plugin:prettier/recommended', // 启用 Prettier 与 ESLint 的集成
  ],

  // 解析器选项
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },

  // 插件
  plugins: ['@typescript-eslint', 'react', 'prettier'],

  // 设置
  settings: { react: { version: 'detect' } },

  // 规则配置
  rules: {
    // TypeScript 相关规则
    '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any 类型
    '@typescript-eslint/no-unused-vars': 'warn', // 禁止未使用的变量
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数返回类型的显式声明
    '@typescript-eslint/no-empty-function': 'error', // 禁止空函数
    '@typescript-eslint/no-non-null-assertion': 'error', // 禁止使用非空断言
    '@typescript-eslint/no-var-requires': 'off', // 关闭禁止使用 require 语句的检查

    // React 相关规则
    'react/prop-types': 'off', // 关闭 Prop-types 的检查
    'react/display-name': 'off', // 关闭组件 display name 的检查
    'react/no-unescaped-entities': 'error', // 禁止在字符串和注释中使用未转义的特殊字符
    'react/jsx-uses-react': 'off', // 关闭检查 JSX 中是否导入了 React
    'react/jsx-uses-vars': 'error', // 检查是否使用了 JSX 变量
    'react/react-in-jsx-scope': 'off', // 关闭检查 JSX 中是否导入了 React（通常由 Babel 处理，因此在 TypeScript 中可以关闭）

    // 其他规则
    'no-console': 'warn', // 警告不允许使用 console
    'no-unused-vars': 'warn', // 警告未使用的变量
    'no-undef': 'error', // 禁止使用未声明的变量
    'prettier/prettier': 'error', // 强制执行 Prettier 格式化规则
  },

  // 忽略指定文件或目录
  ignorePatterns: ['/node_modules/**', '/build/**'],

  // 覆盖配置
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      excludedFiles: 'node_modules/**',
      rules: {
        // 在这里添加只对 src 文件夹生效的规则
      },
    },
  ],
};
```

在 VSCode 中可以配置自动修复 ESLint 错误，项目根目录新建 .vscode 文件夹，创建 settings.json 文件，添加以下内容

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit",
    "eslint.autoFixOnSave": "explicit"
  }
}
```

### Husky

```
pnpm i husky

pnpm exec husky init
```

安装 husky 后，执行 `pnpm exec husky init` 命令，之后会在根目录生成 .husky 文件，并更新 package.json 文件

```json
"scripts": {
  "prepare": "husky"
},
```

### Lint-Staged

```
npm i lint-staged
```

使用预提交钩子检查暂存文件，并将以下代码更新到 .husky/pre-commit 文件中

```
npx lint-staged
```

在 package.json 文件中添加以下 lint-staged 配置

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json}": [
    "eslint --fix"
  ],
  "*.{js,jsx,ts,tsx,json,css,scss,less,md}": [
    "prettier --write"
  ]
},
```

### Commitlint

```
pnpm i @commitlint/{config-conventional,cli}
```

在项目根目录下创建 commitlint.config.js 文件，并添加以下内容

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

将以下代码更新到 .husky/commit-msg 文件

```
npx --no-install commitlint --edit "$1"
```

到此，我们就完成代码规范的基本配置，以下是代码提交格式

```
[
  'build',     // 对项目构建或外部依赖项的更改
  'chore',     // 对构建过程或辅助工具的更改
  'ci',        // 对持续集成 (CI) 配置文件和脚本的更改
  'docs',      // 对文档的更改
  'feat',      // 添加新功能
  'fix',       // 修复 bug
  'perf',      // 对性能的改进
  'refactor',  // 对代码重构的更改
  'revert',    // 撤销之前的提交
  'style',     // 对代码风格、格式的更改，不影响代码逻辑
  'test'       // 添加或修改测试代码
];

echo "foo: some message" # fails
echo "fix: some message" # passes

echo "fix(SCOPE): Some message" # fails
echo "fix(SCOPE): Some Message" # fails
echo "fix(SCOPE): SomeMessage" # fails
echo "fix(SCOPE): SOMEMESSAGE" # fails
echo "fix(scope): some message" # passes
echo "fix(scope): some Message" # passes
```
