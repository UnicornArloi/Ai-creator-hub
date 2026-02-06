import React, { useState, useEffect } from 'react'

export default function PosterPage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [projectName, setProjectName] = useState('')
  const [designType, setDesignType] = useState('Logo')
  const [style, setStyle] = useState('Cyberpunk')
  const [tagline, setTagline] = useState('')

  const designTypes = ['Logo', 'Banner', 'Social Media', 'Airdrop Poster']
  const styles = ['Cyberpunk', 'Minimal', 'Gradient', 'Cute']

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

  const generate = () => {
    if (!connected) {
      connect()
      return
    }
    alert('Generating poster...')
  }

  const download = () => {
    if (!connected) {
      connect()
      return
    }
    alert('Downloading...')
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

        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px' }}>Poster Design</h1>
        <p style={{ color: '#888', marginBottom: '50px', fontSize: '1.1rem' }}>AI-powered poster & banner generation</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Project Name</label>
              <input type="text" placeholder="e.g. DeFi Token" value={projectName} onChange={e => setProjectName(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Design Type</label>
              <select value={designType} onChange={e => setDesignType(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }}>
                {designTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }}>
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Tagline (Optional)</label>
              <input type="text" placeholder="Your catchy tagline" value={tagline} onChange={e => setTagline(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div>
              <button onClick={generate} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', marginRight: '12px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508' }}>Generate Poster</button>
              <button onClick={download} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Download</button>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', position: 'sticky', top: '80px' }}>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px', letterSpacing: '1px' }}>// PREVIEW</div>
            <div style={{ background: style === 'Cyberpunk' ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : style === 'Minimal' ? 'linear-gradient(135deg, #f5f5f5, #e0e0e0)' : style === 'Gradient' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #ff9a9e, #fecfef)', borderRadius: '8px', padding: '30px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <img src="icons/icon-poster.svg" style={{ width: '64px', height: '64px', marginBottom: '15px' }} alt="Poster" />
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>{projectName || 'Project Name'}</div>
              <div style={{ color: '#ff00ff', fontSize: '1rem' }}>{tagline || 'Your tagline here'}</div>
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.85rem', color: '#888' }}>
                Style: {style}
              </div>
            </div>
          </div>
        </div>

        <footer style={{ padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>AI Creator Hub © 2024</p>
        </footer>
      </div>
    </div>
  )
}
