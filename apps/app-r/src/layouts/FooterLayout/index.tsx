export function FooterLayout() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="container app-footer__inner">
        <div className="muted">© {year} AppR</div>
        <div>
          <a className="nav-link" href="#/privacy">隐私</a>
          <a className="nav-link" href="#/terms">条款</a>
        </div>
      </div>
    </footer>
  );
}