export function HeaderLayout() {
  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <div className="brand">
          <div className="brand__logo" />
          <div className="brand__title">AppR</div>
        </div>
        <div className="header-actions">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.35-4.35" stroke="#a6b3cc" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="7" stroke="#a6b3cc" strokeWidth="2"/>
            </svg>
            <input placeholder="搜索..." />
          </div>
          <button className="btn">登录</button>
          <button className="btn btn--primary">注册</button>
        </div>
      </div>
    </header>
  );
}