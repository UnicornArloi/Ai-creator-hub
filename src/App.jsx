import React, { useState, useEffect } from 'react'
import TokenPage from './pages/TokenPage'
import BusinessPlanPage from './pages/BusinessPlanPage'
import PPTPage from './pages/PPTPage'
import PosterPage from './pages/PosterPage'
import DocsPage from './pages/DocsPage'
import WebsitePage from './pages/WebsitePage'

function App() {
  const [page, setPage] = useState('home')
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')

  useEffect(() => {
    const handleHash = () => setPage(window.location.hash.slice(1) || 'home')
    window.addEventListener('hashchange', handleHash)
    handleHash()
  }, [])

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

  const tools = [
    { id: 'token', icon: 'icons/icon-token.svg', name: 'Create Token', desc: 'Launch your token in seconds' },
    { id: 'bp', icon: 'icons/icon-bp.svg', name: 'Business Plan', desc: 'AI-generated professional BP' },
    { id: 'ppt', icon: 'icons/icon-ppt.svg', name: 'PPT Generator', desc: 'One-click pitch deck generation' },
    { id: 'poster', icon: 'icons/icon-poster.svg', name: 'Poster Design', desc: 'Logo, Banner, Social media' },
    { id: 'docs', icon: 'icons/icon-docs.svg', name: 'Docs Generator', desc: 'Whitepaper, Technical docs' },
    { id: 'website', icon: 'icons/icon-web.svg', name: 'Website Builder', desc: 'One-click site with IPFS deploy' },
  ]

  const scrollToTools = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Subpages
  if (page === 'token') {
    return <TokenPage />
  }

  if (page === 'bp') {
    return <BusinessPlanPage />
  }

  if (page === 'ppt') {
    return <PPTPage />
  }

  if (page === 'poster') {
    return <PosterPage />
  }

  if (page === 'docs') {
    return <DocsPage />
  }

  if (page === 'website') {
    return <WebsitePage />
  }

  if (page !== 'home' && page !== '') {
    const tool = tools.find(t => t.id === page)
    return (
      <div style={{ minHeight: '100vh', background: '#050508', color: 'white', position: 'relative' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '2px', color: 'white' }}>AI Creator Hub</div>
            <button onClick={() => window.location.hash = ''} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>← Back to Home</button>
          </header>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '40px', letterSpacing: '-0.5px', color: 'white' }}>
            {tool?.name || page}
          </h1>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '60px', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '20px' }}>
              {tool?.desc || 'AI-powered tool'}
            </p>
            <button style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', border: 'none', borderRadius: '8px', color: '#050508', fontWeight: 500, cursor: 'pointer', fontSize: '1rem' }}>
              Generate with AI
            </button>
          </div>
          
          <footer style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginTop: '60px' }}>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>AI Creator Hub © 2024</p>
          </footer>
        </div>
      </div>
    )
  }

  // Home page
  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', position: 'relative' }}>
      <style>{`
        .tool-card:hover {
          background: rgba(255,255,255,0.08) !important;
          transform: translateY(-4px);
        }
        .tool-card:hover .enter-btn {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .tool-card {
          transition: all 0.3s;
        }
        .enter-btn {
          transition: all 0.3s;
        }
      `}</style>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }}></div>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '2px', color: 'white' }}>AI Creator Hub</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: connected ? '#00ff88' : '#ff4444', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{connected ? addr.slice(0, 6) + '...' + addr.slice(-4) : 'Not Connected'}</span>
            </div>
            <button onClick={connected ? disconnect : connect} style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: connected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: connected ? 'white' : '#050508', border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </header>

        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 0' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px', color: 'white' }}>
            Create with <span style={{ background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#ccc', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
            Create Token · AI Business Plan · PPT · Poster · Website<br />
            Build your crypto project with AI - fast, simple, no coding required
          </p>
          <div>
            <button onClick={scrollToTools} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', marginRight: '16px' }}>
              Start Creating →
            </button>
            <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
              Learn More
            </a>
          </div>

          <div style={{ display: 'flex', gap: '60px', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '60px 0' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>6+</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>AI Tools</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>10s</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>Fast Generation</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>0</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>No Coding</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>90%</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '4px' }}>Save Cost</div>
            </div>
          </div>
        </section>

        <section id="tools" style={{ padding: '80px 0' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '50px', letterSpacing: '-0.5px', color: 'white' }}>AI Tools</h2>
          <p style={{ color: '#ccc', marginBottom: '50px', fontSize: '1.1rem' }}>Six core tools for all your project needs</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {tools.map(tool => (
              <div key={tool.id} className="tool-card" onClick={() => window.location.hash = tool.id} style={{ display: 'flex', flexDirection: 'column', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: 'white', cursor: 'pointer' }}>
                <div style={{ marginBottom: '20px', width: '64px', height: '64px', filter: 'brightness(1.3)' }}>
                  <img src={tool.icon} alt={tool.name} style={{ width: '100%', height: '100%' }} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px', color: 'white' }}>{tool.name}</h3>
                <p style={{ fontSize: '0.95rem', color: '#bbb', flexGrow: 1 }}>{tool.desc}</p>
                <span className="enter-btn" style={{ display: 'inline-block', marginTop: '15px', padding: '8px 20px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, opacity: 0, transform: 'translateY(10px)' }}>Enter →</span>
              </div>
            ))}
          </div>
        </section>

        <section id="features" style={{ padding: '80px 0' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '50px', letterSpacing: '-0.5px', color: 'white' }}>Core Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
            {[
              { icon: '🤖', title: 'AI-Powered', desc: 'Built with GPT-4 + DALL-E 3, understanding your needs and generating content, code, and images automatically' },
              { icon: '⚡', title: 'Instant Deploy', desc: 'One-click deployment to BSC with automatic contract verification' },
              { icon: '💎', title: 'Ultra Low Gas', desc: 'Built on BSC for minimal fees - 90% cheaper than ETH' },
              { icon: '🌐', title: 'IPFS Publishing', desc: 'Decentralized storage, always available' },
            ].map((f, i) => (
              <div key={i} style={{ padding: '30px 0' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px', color: 'white' }}>{f.icon} {f.title}</h3>
                <p style={{ color: '#bbb', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '-1px', color: 'white' }}>Start Your Crypto Project</h2>
          <p style={{ color: '#ccc', marginBottom: '40px', fontSize: '1.1rem' }}>No coding required - launch in minutes</p>
          <button onClick={scrollToTools} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', border: 'none', borderRadius: '8px', color: '#050508', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>
            Get Started →
          </button>
        </section>

        <footer style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>AI Creator Hub © 2024</p>
        </footer>
      </div>
    </div>
  )
}

export default App
