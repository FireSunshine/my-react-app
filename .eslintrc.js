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
