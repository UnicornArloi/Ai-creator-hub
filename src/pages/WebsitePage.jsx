import React, { useState, useEffect } from 'react'
import { generateWebsite } from '../utils/aiApi'

export default function WebsitePage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [projectName, setProjectName] = useState('')
  const [theme, setTheme] = useState('Dark')
  const [description, setDescription] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setAddr(accounts[0])
          setConnected(true)
        }
      })
    }
  }, [])

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length > 0) {
          setAddr(accounts[0])
          setConnected(true)
        }
      } catch (e) {
        alert('Please install MetaMask')
      }
    } else {
      alert('Please install MetaMask')
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAddr('')
  }

  const generate = async () => {
    if (!connected) {
      connect()
      return
    }
    if (!projectName) {
      alert('Please enter project name')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedContent('')

    try {
      const content = await generateWebsite(projectName, description)
      setGeneratedContent(content)
    } catch (err) {
      setError('Failed to generate: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const deployToIPFS = () => {
    alert('Deploying to IPFS...')
  }

  const themeBg = theme === 'Dark' ? 'linear-gradient(135deg, #0f0f1a, #1a1a2e)' : theme === 'Light' ? 'linear-gradient(135deg, #f5f5f5, #ffffff)' : 'linear-gradient(135deg, #667eea, #764ba2)'

  const styles = {
    container: { minHeight: '100vh', background: '#050508', color: 'white', position: 'relative' },
    fixedBg: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0 },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1 },
    main: { position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '0 40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' },
    logo: { fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px' },
    homeBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' },
    h1: { fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px' },
    subtitle: { color: '#888', marginBottom: '30px', fontSize: '1.11rem' },
    walletBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' },
    walletInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    statusDot: { width: '10px', height: '10px', borderRadius: '50%' },
    walletLabel: { fontSize: '0.95rem', color: connected ? '#00ff88' : 'white' },
    walletSub: { fontSize: '0.85rem', color: '#888' },
    connectBtn: { padding: '12px 24px', fontSize: '0.9rem', fontWeight: 500, borderRadius: '8px', background: connected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: connected ? 'white' : '#050508', border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none', cursor: 'pointer' },
    formBox: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', marginBottom: '40px' },
    formSection: { marginBottom: '30px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' },
    select: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' },
    textarea: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' },
    generateBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1rem', fontWeight: 500, border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', marginRight: '12px', cursor: 'pointer' },
    deployBtn: { padding: '16px 32px', fontSize: '1rem', fontWeight: 500, border: 'none', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' },
    error: { marginTop: '20px', padding: '16px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', color: '#ff4444' },
    features: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)' },
    featureItem: { textAlign: 'center' },
    featureIcon: { fontSize: '1.8rem', marginBottom: '10px' },
    featureTitle: { fontSize: '1rem', fontWeight: 500, marginBottom: '6px' },
    featureDesc: { fontSize: '0.9rem', color: '#888' },
    footer: { padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' },
    footerText: { color: '#888', fontSize: '0.85rem' }
  }

  return (
    React.createElement('div', { style: styles.container },
      React.createElement('div', { style: styles.fixedBg }),
      React.createElement('div', { style: styles.overlay }),
      React.createElement('div', { style: styles.main },
        React.createElement('header', { style: styles.header },
          React.createElement('div', { style: styles.logo }, 'AI Creator Hub'),
          React.createElement('button', { style: styles.homeBtn, onClick: () => window.location.hash = '' }, 'Home')
        ),
        React.createElement('h1', { style: styles.h1 }, 'Create Website'),
        React.createElement('p', { style: styles.subtitle }, 'AI-powered website code generation'),
        React.createElement('div', { style: styles.walletBar },
          React.createElement('div', { style: styles.walletInfo },
            React.createElement('div', { style: { ...styles.statusDot, background: connected ? '#00ff88' : '#ff4444' } }),
            React.createElement('div', null,
              React.createElement('div', { style: styles.walletLabel }, connected ? addr.slice(0, 6) + '...' + addr.slice(-4) : 'No Wallet'),
              React.createElement('div', { style: styles.walletSub }, connected ? '' : 'Connect wallet first')
            )
          ),
          React.createElement('button', { style: styles.connectBtn, onClick: connected ? disconnect : connect }, connected ? 'Disconnect' : 'Connect Wallet')
        ),
        React.createElement('div', { style: styles.formBox },
          React.createElement('div', { style: styles.formSection },
            React.createElement('div', { style: styles.inputGroup },
              React.createElement('label', { style: styles.label }, 'Project Name'),
              React.createElement('input', { type: 'text', placeholder: 'e.g. DeFi Protocol', value: projectName, onChange: e => setProjectName(e.target.value), style: styles.input })
            ),
            React.createElement('div', { style: styles.inputGroup },
              React.createElement('label', { style: styles.label }, 'Theme'),
              React.createElement('select', { value: theme, onChange: e => setTheme(e.target.value), style: styles.select },
                React.createElement('option', { value: 'Dark' }, 'Dark'),
                React.createElement('option', { value: 'Light' }, 'Light'),
                React.createElement('option', { value: 'Gradient' }, 'Gradient')
              )
            ),
            React.createElement('div', { style: styles.inputGroup },
              React.createElement('label', { style: styles.label }, 'Description'),
              React.createElement('textarea', { placeholder: 'Brief description...', value: description, onChange: e => setDescription(e.target.value), style: styles.textarea })
            )
          ),
          React.createElement('button', { style: styles.generateBtn, disabled: generating, onClick: generate }, generating ? 'Generating...' : 'Generate Website'),
          generatedContent && React.createElement('button', { style: styles.deployBtn, onClick: deployToIPFS }, 'Deploy to IPFS'),
          error && React.createElement('div', { style: styles.error }, error)
        ),
        React.createElement('div', { style: styles.features },
          React.createElement('div', { style: styles.featureItem },
            React.createElement('div', { style: styles.featureIcon }, '🌐'),
            React.createElement('div', { style: styles.featureTitle }, 'Deploy Online'),
            React.createElement('div', { style: styles.featureDesc }, 'IPFS or GitHub Pages')
          ),
          React.createElement('div', { style: styles.featureItem },
            React.createElement('div', { style: styles.featureIcon }, '🎨'),
            React.createElement('div', { style: styles.featureTitle }, 'Modern Design'),
            React.createElement('div', { style: styles.featureDesc }, 'Responsive layout')
          ),
          React.createElement('div', { style: styles.featureItem },
            React.createElement('div', { style: styles.featureIcon }, '⚡'),
            React.createElement('div', { style: styles.featureTitle }, 'Fast Load'),
            React.createElement('div', { style: styles.featureDesc }, 'Optimized assets')
          )
        ),
        React.createElement('footer', { style: styles.footer },
          React.createElement('p', { style: styles.footerText }, 'AI Creator Hub © 2024')
        )
      )
    )
  )
}
