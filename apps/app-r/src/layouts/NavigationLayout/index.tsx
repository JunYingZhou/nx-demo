export function NavigationLayout() {
  return (
    <nav className="app-nav">
      <div className="container app-nav__inner">
        <a className="nav-link" href="#/home">首页</a>
        <a className="nav-link" href="#/features">功能</a>
        <a className="nav-link" href="#/docs">文档</a>
        <a className="nav-link" href="#/about">关于</a>
      </div>
    </nav>
  );
}