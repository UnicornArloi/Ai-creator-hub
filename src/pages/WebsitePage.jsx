import React, { useState, useEffect } from 'react'
import { generateWebsite } from '../utils/aiApi'

export default function WebsitePage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [projectName, setProjectName] = useState('')
  const [theme, setTheme] = useState('Dark')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState('')
  const [email, setEmail] = useState('')
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

  const copyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
      alert('Copied to clipboard!')
    }
  }

  const themeBg = theme === 'Dark' ? 'linear-gradient(135deg, #0f0f1a, #1a1a2e)' : theme === 'Light' ? 'linear-gradient(135deg, #f5f5f5, #ffffff)' : 'linear-gradient(135deg, #667eea, #764ba2)'

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }}></div>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px' }}>AI Creator Hub</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => window.location.hash = ''} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>← Home</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: connected ? '#00ff88' : '#ff4444', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>{connected ? addr.slice(0, 6) + '...' + addr.slice(-4) : 'Not Connected'}</span>
            </div>
            <button onClick={connected ? disconnect : connect} style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '6px', background: connected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: connected ? 'white' : '#050508', border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </header>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px' }}>Website Builder</h1>
        <p style={{ color: '#888', marginBottom: '50px', fontSize: '1.1rem' }}>AI-powered website generation with IPFS deployment</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Project Name</label>
              <input type="text" placeholder="e.g. DeFi Protocol" value={projectName} onChange={e => setProjectName(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }}>
                <option>Dark</option>
                <option>Light</option>
                <option>Gradient</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Description</label>
              <textarea placeholder="Brief description..." value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Features</label>
              <input type="text" placeholder="e.g. Staking, Swap, Wallet" value={features} onChange={e => setFeatures(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Contact Email</label>
              <input type="email" placeholder="contact@project.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div>
              <button onClick={generate} disabled={generating} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', marginRight: '12px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', opacity: generating ? 0.5 : 1 }}>
                {generating ? '🤖 Generating...' : '🤖 Generate Website'}
              </button>
              <button onClick={copyContent} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>📋 Copy</button>
            </div>

            {error && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', color: '#ff4444' }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', position: 'sticky', top: '80px' }}>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px', letterSpacing: '1px' }}>// {generatedContent ? 'AI GENERATED' : 'PREVIEW'}</div>
            
            {generatedContent ? (
              <div style={{ background: 'white', color: '#333', borderRadius: '8px', padding: '24px', minHeight: '400px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {generatedContent}
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#1a1a2e', padding: '10px 15px', display: 'flex', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27ca3f' }}></div>
                </div>
                <div style={{ padding: '20px', minHeight: '250px', background: themeBg }}>
                  <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <h3 style={{ color: theme === 'Light' ? '#1a1a2e' : 'white', fontSize: '1.2rem', marginBottom: '8px' }}>{projectName || 'Project Name'}</h3>
                    <p style={{ color: '#ff00ff', fontSize: '0.85rem' }}>{description || 'Project description'}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '5px' }}>⚡</span>
                      <small style={{ fontSize: '0.7rem', color: '#888' }}>Fast</small>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '5px' }}>🔒</span>
                      <small style={{ fontSize: '0.7rem', color: '#888' }}>Secure</small>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '5px' }}>🌐</span>
                      <small style={{ fontSize: '0.7rem', color: '#888' }}>Web3</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer style={{ padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>AI Creator Hub © 2024</p>
        </footer>
      </div>
    </div>
  )
}
