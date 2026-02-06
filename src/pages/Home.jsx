import { useState, useEffect } from 'react'

export default function Home({ walletConnected, walletAddress, onConnect, onDisconnect }) {
  const tools = [
    { href: '/token', icon: '🪙', title: 'Create Token', desc: 'Launch your token in seconds' },
    { href: '/bp', icon: '📊', title: 'Business Plan', desc: 'AI-generated professional BP' },
    { href: '/ppt', icon: '📑', title: 'PPT Generator', desc: 'One-click pitch deck' },
    { href: '/poster', icon: '🎨', title: 'Poster Design', desc: 'Logo, Banner, Social media' },
    { href: '/docs', icon: '📄', title: 'Docs Generator', desc: 'Whitepaper, Technical docs' },
    { href: '/website', icon: '🌐', title: 'Website Builder', desc: 'One-click site with IPFS' },
  ]

  return (
    <div style={{ background: '#050508', minHeight: '100vh', padding: '0 40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '2px', color: 'white' }}>AI Creator Hub</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: walletConnected ? '#00ff88' : '#ff4444', borderRadius: '50%' }}></div>
            <div style={{ fontSize: '0.85rem', color: '#888' }}>
              {walletConnected ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : 'Not Connected'}
            </div>
          </div>
          <button onClick={walletConnected ? onDisconnect : onConnect} style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px', background: walletConnected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: walletConnected ? 'white' : '#050508', border: walletConnected ? '1px solid rgba(255,255,255,0.3)' : 'none' }}>
            {walletConnected ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </header>

      <section style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
          <span style={{ background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          <span style={{ color: 'white' }}> Creator Hub</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#888', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
          Create Token · AI Business Plan · PPT · Poster · Website<br />
          Build your crypto project with AI - fast, simple
        </p>
        <div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508' }}>
            Start Creating
          </button>
        </div>

        <div style={{ display: 'flex', gap: '60px', marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '40px 0' }}>
          {[
            { num: '6+', label: 'AI Tools' },
            { num: '10s', label: 'Fast' },
            { num: '0', label: 'Coding' },
            { num: '90%', label: 'Save' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #ff00ff, #00ffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.num}</div>
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '50px', color: 'white' }}>AI Tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {tools.map((tool, i) => (
            <a key={i} href={tool.href} style={{ display: 'flex', flexDirection: 'column', padding: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', color: 'white', borderRadius: '12px' }}>
              <div style={{ width: '64px', height: '64px', marginBottom: '20px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {tool.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>{tool.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#888' }}>{tool.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '50px', color: 'white' }}>Core Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
          {[
            { icon: '🤖', title: 'AI-Powered', desc: 'Built with GPT-4 + DALL-E 3' },
            { icon: '⚡', title: 'Instant Deploy', desc: 'One-click deployment to BSC' },
            { icon: '💎', title: 'Ultra Low Gas', desc: '90% cheaper than ETH' },
            { icon: '🌐', title: 'IPFS Publishing', desc: 'Decentralized storage' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '30px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px', color: 'white' }}>{f.icon} {f.title}</h3>
              <p style={{ color: '#888', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>AI Creator Hub © 2024</p>
      </footer>
    </div>
  )
}
