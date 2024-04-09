module.exports = {
  extends: ['@commitlint/config-conventional'],
};

/* 
  feat：新功能（feature）
  fix：修复 bug
  docs：文档变更
  style：代码格式、样式调整，不影响代码逻辑
  refactor：重构代码，既不修复 bug 也不添加新功能
  test：添加或修改测试代码
  chore：构建过程或辅助工具的变动
  perf：性能优化
  ci：CI/CD 相关的变化
  build：项目构建系统或外部依赖项的改变
  revert：撤销之前的提交 
*/
