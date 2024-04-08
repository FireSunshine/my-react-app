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
