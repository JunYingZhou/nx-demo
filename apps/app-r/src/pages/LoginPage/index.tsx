import { useState } from 'react';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('登录信息:', { username, password, remember });
  };

  return (
    <div style={styles.pageContainer}>
      <div className="login-container" style={styles.loginContainer}>
        {/* 左侧图片展示 */}
        <div className="login-img" style={styles.loginImgContainer}>
          <img 
            style={styles.loginImg} 
            src="https://s.alicdn.com/@img/imgextra/i3/O1CN01s41VY31CJ4SCQiPVm_!!6000000000059-0-tps-1920-1600.jpg" 
            alt="login-bg" 
          />
          <div style={styles.imageOverlay}>
            <h2 style={styles.welcomeTitle}>欢迎回来</h2>
            <p style={styles.welcomeText}>登录您的账户以继续使用我们的服务</p>
          </div>
        </div>
        
        {/* 右侧表单展示 */}
        <div className="login-form" style={styles.loginForm}>
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <h1 style={styles.formTitle}>登录</h1>
              <p style={styles.formSubtitle}>请输入您的账户信息</p>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <input 
                  type="text" 
                  placeholder="用户名" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <input 
                  type="password" 
                  placeholder="密码" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
              
              <div style={styles.checkboxGroup}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="remember" style={styles.checkboxLabel}>记住我</label>
              </div>
              
              <button type="submit" style={styles.submitButton}>
                登录
              </button>
            </form>
            
            <div style={styles.formFooter}>
              <p style={styles.footerText}>
                还没有账户？ <a href="#" style={styles.link}>立即注册</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '600px',
    maxWidth: '1000px',
    width: '100%',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  loginImgContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  loginImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    padding: '40px',
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    margin: '0 0 16px 0',
  },
  welcomeText: {
    fontSize: '1.1rem',
    opacity: 0.9,
    lineHeight: 1.6,
    margin: 0,
  },
  loginForm: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  formSubtitle: {
    color: '#718096',
    fontSize: '1rem',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    background: '#f8fafc',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#667eea',
  },
  checkboxLabel: {
    color: '#4a5568',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  formFooter: {
    textAlign: 'center',
    marginTop: '32px',
  },
  footerText: {
    color: '#718096',
    fontSize: '0.9rem',
    margin: 0,
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
};