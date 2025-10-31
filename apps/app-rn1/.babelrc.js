module.exports = function (api) {
  api.cache(true);

  // 如果是 build 或 storybook
  if (
    process.env.NX_TASK_TARGET_TARGET === 'build' ||
    process.env.NX_TASK_TARGET_TARGET?.includes('storybook')
  ) {
    return {
      presets: [
        [
          '@nx/react/babel',
          {
            runtime: 'automatic',
          },
        ],
      ],
    };
  }

  return {
    presets: [
      ['module:@react-native/babel-preset', { useTransformReactJSX: true }],
    ],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',  // 导入时的模块名
          path: '.env',        // env 文件路径
          safe: false,         // 是否强制要求所有变量存在
          allowUndefined: true // 允许未定义变量
        },
      ],
    ],
  };
};
