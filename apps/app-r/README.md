public/：不会被 Webpack/Vite 处理，直接拷贝到最终打包目录。

src/api/：存放请求封装，避免业务逻辑和接口耦合。

src/components/：复用性高的 UI 组件。

src/hooks/：自定义 Hook（如 useAuth、useFetch）。

src/layouts/：页面整体布局（导航、侧边栏、footer）。

src/pages/：业务页面。

src/router/：路由集中管理。

src/store/：全局状态管理（Redux Toolkit、Zustand、Jotai 等）。

src/utils/：工具函数库。