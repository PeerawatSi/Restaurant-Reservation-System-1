import React from 'react';
import { loginWithGoogle } from '../../services/api';

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🍽️</span>
        </div>
        
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to reserve your perfect dining experience</p>
        
        <button onClick={loginWithGoogle} style={styles.googleButton}>
          <svg style={styles.googleIcon} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🥗</span>
            <span style={styles.featureText}>Convenience</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🔒</span>
            <span style={styles.featureText}>Secure & Safe</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🎉</span>
            <span style={styles.featureText}>Best Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #501e81ff 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem'
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0
  },
  shape1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    top: '-100px',
    right: '-100px',
    animation: 'float 6s ease-in-out infinite'
  },
  shape2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    bottom: '-50px',
    left: '-50px',
    animation: 'float 8s ease-in-out infinite'
  },
  shape3: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 7s ease-in-out infinite'
  },
  card: {
    background: 'white',
    padding: '3rem 2.5rem',
    borderRadius: '24px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
    textAlign: 'center',
    maxWidth: '480px',
    width: '100%',
    position: 'relative',
    zIndex: 1
  },
  iconContainer: {
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
  },
  icon: {
    fontSize: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
    color: '#2d3748',
    fontWeight: '800'
  },
  subtitle: {
    color: '#718096',
    marginBottom: '2.5rem',
    fontSize: '1.05rem',
    lineHeight: '1.6'
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '1.25rem 1.5rem',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    background: 'white',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    color: '#2d3748'
  },
  googleIcon: {
    width: '24px',
    height: '24px',
  },
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '2.5rem',
    paddingTop: '2rem',
    borderTop: '2px solid #e2e8f0'
  },
  feature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  featureIcon: {
    fontSize: '1.8rem'
  },
  featureText: {
    fontSize: '0.85rem',
    color: '#718096',
    fontWeight: '600'
  }
};

export default Login;