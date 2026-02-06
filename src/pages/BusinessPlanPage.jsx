import React, { useState, useEffect, useRef } from 'react'
import { generateBusinessPlan } from '../utils/aiApi'
import html2pdf from 'html2pdf.js'

export default function BusinessPlanPage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [projectName, setProjectName] = useState('')
  const [industry, setIndustry] = useState('DeFi / Web3')
  const [features, setFeatures] = useState('')
  const [market, setMarket] = useState('')
  const [revenue, setRevenue] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')
  const pdfRef = useRef(null)

  const industries = ['DeFi / Web3', 'GameFi', 'NFT Platform', 'Infrastructure', 'Consumer App']

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
      const description = `Industry: ${industry}\nFeatures: ${features}\nTarget Market: ${market}\nRevenue Model: ${revenue}`
      const content = await generateBusinessPlan(projectName, description)
      setGeneratedContent(content)
    } catch (err) {
      setError('Failed to generate: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const downloadPDF = () => {
    if (!generatedContent || !pdfRef.current) return

    const element = pdfRef.current
    const opt = {
      margin: 20,
      filename: `${projectName || 'Business_Plan'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
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

        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px' }}>Business Plan</h1>
        <p style={{ color: '#888', marginBottom: '50px', fontSize: '1.1rem' }}>AI-powered professional BP document generation</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Project Name</label>
              <input type="text" placeholder="e.g. DeFi Yield Platform" value={projectName} onChange={e => setProjectName(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Industry</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }}>
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Key Features</label>
              <textarea placeholder="Describe your project's key features..." value={features} onChange={e => setFeatures(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Target Market</label>
              <input type="text" placeholder="e.g. Asia Pacific crypto users" value={market} onChange={e => setMarket(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Revenue Model</label>
              <textarea placeholder="How will the project generate revenue?" value={revenue} onChange={e => setRevenue(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div>
              <button onClick={generate} disabled={generating} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', marginRight: '12px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', opacity: generating ? 0.5 : 1 }}>
                {generating ? '🤖 Generating...' : '📄 Generate BP PDF'}
              </button>
              {generatedContent && (
                <button onClick={downloadPDF} style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>⬇️ Download PDF</button>
              )}
            </div>

            {error && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', color: '#ff4444' }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', position: 'sticky', top: '80px' }}>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px', letterSpacing: '1px' }}>// {generatedContent ? 'AI GENERATED PDF PREVIEW' : 'PREVIEW'}</div>
            
            {generatedContent ? (
              <div ref={pdfRef} style={{ background: 'white', color: '#333', borderRadius: '8px', padding: '24px', minHeight: '400px', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #ff00ff' }}>
                  <h1 style={{ color: '#1a1a2e', fontSize: '1.5rem', marginBottom: '10px' }}>{projectName}</h1>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Business Plan</p>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.8, color: '#333' }}>
                  {generatedContent}
                </div>
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
                  Generated by AI Creator Hub • {new Date().toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div style={{ background: 'white', color: '#333', borderRadius: '8px', padding: '24px', minHeight: '400px' }}>
                <h1 style={{ color: '#1a1a2e', fontSize: '1.5rem', marginBottom: '15px' }}>{projectName || 'Project Name'}</h1>
                <p><strong>Industry:</strong> {industry}</p>
                <h2 style={{ color: '#16213e', fontSize: '1.2rem', margin: '20px 0 10px' }}>Executive Summary</h2>
                <p style={{ color: '#4a4a6a', lineHeight: 1.8, marginBottom: '12px' }}>A revolutionary project that transforms the industry with innovative solutions.</p>
                <h2 style={{ color: '#16213e', fontSize: '1.2rem', margin: '20px 0 10px' }}>Market Opportunity</h2>
                <p style={{ color: '#4a4a6a', lineHeight: 1.8, marginBottom: '12px' }}>{market || 'Targeting the growing blockchain user base in Asia Pacific.'}</p>
                <h2 style={{ color: '#16213e', fontSize: '1.2rem', margin: '20px 0 10px' }}>Product Features</h2>
                <ul style={{ color: '#4a4a6a', marginLeft: '20px', marginBottom: '12px' }}>
                  <li>Feature 1: Innovative solution</li>
                  <li>Feature 2: User-friendly design</li>
                  <li>Feature 3: Secure and scalable</li>
                </ul>
                <h2 style={{ color: '#16213e', fontSize: '1.2rem', margin: '20px 0 10px' }}>Revenue Model</h2>
                <p style={{ color: '#4a4a6a', lineHeight: 1.8 }}>{revenue || 'Sustainable revenue through transaction fees and premium services.'}</p>
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
