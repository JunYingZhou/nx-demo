import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const theme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1976D2',        // Blue 700 - 强调主按钮
      secondary: '#455A64',      // Blue Grey 700 - 内容辅助区域
      error: '#D32F2F',          // Red 700 - 错误提示
      text: 'green',           // Grey 900 - 主文本
      border: '#BDBDBD',         // Grey 400 - 中性边框
      activeTab: '#1976D2',      // Blue 700
      inactiveTab: '#9E9E9E',    // Grey 500 - 不活跃状态更柔和
      background: '#FAFAFA',     // Grey 50 - 背景更明亮
      card: '#FFFFFF',           // 通常用于导航容器
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#90CAF9',        // Blue 200 - 暗色模式的主色亮度更高
      secondary: '#607D8B',      // Blue Grey 500
      error: '#EF5350',          // Red 400 - 暗色下高亮错误更醒目
      text: '#FFFFFF',           // 白色文本
      border: '#757575',         // Grey 600 - 暗色边框略显
      activeTab: '#90CAF9',      // Blue 200
      inactiveTab: '#B0BEC5',    // Blue Grey 200 - 暗色中不活跃的更浅
      background: '#121212',     // 标准暗黑背景
      card: '#1E1E1E',           // 卡片容器稍亮区分
    },
  },
};
