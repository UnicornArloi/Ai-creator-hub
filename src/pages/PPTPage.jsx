import React, { useState, useEffect } from 'react'
import { generatePPT } from '../utils/aiApi'

export default function PPTPage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('Pitch Deck')
  const [pages, setPages] = useState(12)
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
    if (!topic) {
      alert('Please enter presentation topic')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedContent('')

    try {
      const content = await generatePPT(topic, type)
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

        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px' }}>PPT Generator</h1>
        <p style={{ color: '#888', marginBottom: '50px', fontSize: '1.1rem' }}>AI-powered pitch deck generation</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Presentation Topic</label>
              <input type="text" placeholder="e.g. DeFi Yield Platform" value={topic} onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>PPT Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }}>
                <option>Pitch Deck</option>
                <option>Whitepaper Summary</option>
                <option>Product Demo</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Number of Slides: {pages}</label>
              <input type="range" min="5" max="30" value={pages} onChange={e => setPages(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <button onClick={generate} disabled={generating} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', marginRight: '12px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', opacity: generating ? 0.5 : 1 }}>
                {generating ? '🤖 Generating...' : '🤖 Generate PPT'}
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
              <div style={{ background: 'white', color: '#333', borderRadius: '8px', padding: '24px', minHeight: '400px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#1a1a2e' }}>{topic || 'Project Name'}</h3>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>Professional {type.toLowerCase()} including: Problem Analysis, Solution, Market Opportunity, Business Model, Tokenomics, Team, Roadmap.</p>
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
