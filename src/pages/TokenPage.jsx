import React, { useState, useEffect } from 'react'
import { generateToken } from '../utils/aiApi'

export default function TokenPage() {
  const [connected, setConnected] = useState(false)
  const [addr, setAddr] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenSupply, setTokenSupply] = useState('')
  const [taxEnabled, setTaxEnabled] = useState(true)
  const [selectedTax, setSelectedTax] = useState(1)
  const [walletSlider, setWalletSlider] = useState(0)
  const [burnSlider, setBurnSlider] = useState(0)
  const [dividendSlider, setDividendSlider] = useState(0)
  const [liquiditySlider, setLiquiditySlider] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [generatedContract, setGeneratedContract] = useState('')
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

  const deployToken = async () => {
    if (!connected) {
      alert('Connect wallet first')
      return
    }
    if (!tokenName || !tokenSymbol || !tokenSupply) {
      alert('Please fill in all fields')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedContract('')

    try {
      const contract = await generateToken(tokenName, tokenSymbol, tokenSupply)
      setGeneratedContract(contract)
    } catch (err) {
      setError('Failed to generate contract: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const copyContract = () => {
    navigator.clipboard.writeText(generatedContract)
    alert('Contract copied to clipboard!')
  }

  const toggleTax = () => {
    setTaxEnabled(!taxEnabled)
  }

  const selectTax = (rate, btn) => {
    setSelectedTax(rate)
  }

  const taxRates = [1, 3, 5, 10]

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'url(bg.jpg) center/cover fixed', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', zIndex: 1 }}></div>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px' }}>AI Creator Hub</div>
          <button onClick={() => window.location.hash = ''} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'none' }}>← Home</button>
        </header>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.5px' }}>Create Token</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', background: connected ? '#00ff88' : '#ff4444', borderRadius: '50%' }}></div>
            <div>
              <div style={{ fontSize: '0.95rem', color: connected ? '#00ff88' : 'white' }}>{connected ? addr.slice(0, 6) + '...' + addr.slice(-4) : 'No Wallet'}</div>
              <div style={{ fontSize: '0.85rem', color: '#888' }}>{connected ? '' : 'Connect wallet first'}</div>
            </div>
          </div>
          <button onClick={connected ? disconnect : connect} style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 500, borderRadius: '8px', background: connected ? 'transparent' : 'linear-gradient(135deg, #ff00ff, #00ffff)', color: connected ? 'white' : '#050508', border: connected ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
            {connected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', marginBottom: '40px' }}>
          <div style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Token Name</label>
              <input type="text" placeholder="Bitcoin" value={tokenName} onChange={e => setTokenName(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Token Symbol</label>
              <input type="text" placeholder="BTC" value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value.toUpperCase())} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px', textTransform: 'uppercase' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Initial Supply</label>
              <input type="number" placeholder="1000000000" value={tokenSupply} onChange={e => setTokenSupply(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Enable Tax</span>
              <div onClick={toggleTax} style={{ width: '50px', height: '26px', background: taxEnabled ? 'linear-gradient(135deg, #ff00ff, #00ffff)' : 'rgba(255,255,255,0.1)', borderRadius: '13px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: taxEnabled ? '26px' : '2px', transition: '0.3s' }}></div>
              </div>
            </div>

            {taxEnabled && (
              <>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  {taxRates.map(rate => (
                    <button key={rate} onClick={() => selectTax(rate)} style={{ flex: 1, padding: '14px', background: selectedTax === rate ? 'linear-gradient(135deg, #ff00ff, #00ffff)' : 'rgba(0,0,0,0.3)', border: '1px solid', borderColor: selectedTax === rate ? 'transparent' : 'rgba(255,255,255,0.1)', borderRadius: '8px', color: selectedTax === rate ? '#050508' : '#888', fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>{rate}%</button>
                  ))}
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '24px', marginTop: '20px' }}>
                  {[
                    { label: 'Marketing Wallet', value: walletSlider, setValue: setWalletSlider, id: 'wallet' },
                    { label: 'Burn (Reduce Supply)', value: burnSlider, setValue: setBurnSlider, id: 'burn' },
                    { label: 'Dividends (Holder Rewards)', value: dividendSlider, setValue: setDividendSlider, id: 'dividend' },
                    { label: 'Liquidity', value: liquiditySlider, setValue: setLiquiditySlider, id: 'liquidity' },
                  ].map(item => (
                    <div key={item.id} style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#888' }}>{item.label}</span>
                        <span style={{ fontSize: '0.9rem', color: '#ff00ff', fontWeight: 600 }}>{item.value}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={item.value} onChange={e => item.setValue(Number(e.target.value))} style={{ width: '100%', height: '4px', WebkitAppearance: 'none', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {taxEnabled && (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Tax Wallet Address</label>
                <input type="text" placeholder="0x..." style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', borderRadius: '8px' }} />
              </div>
            </div>
          )}

          <button onClick={deployToken} id="deployBtn" disabled={!connected || generating} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 32px', fontSize: '1rem', fontWeight: 500, border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #ff00ff, #00ffff)', color: '#050508', opacity: connected && !generating ? 1 : 0.5, cursor: connected && !generating ? 'pointer' : 'not-allowed' }}>
            {generating ? '🤖 Generating...' : '🤖 Generate Contract'}
          </button>

          {error && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: '8px', color: '#ff4444' }}>
              {error}
            </div>
          )}

          {generatedContract && (
            <div style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>🤖 AI Generated Contract</h3>
                <button onClick={copyContract} style={{ padding: '8px 16px', background: 'rgba(0,255,136,0.2)', border: '1px solid #00ff88', borderRadius: '6px', color: '#00ff88', fontSize: '0.85rem', cursor: 'pointer' }}>📋 Copy</button>
              </div>
              <pre style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', overflow: 'auto', maxHeight: '400px', fontSize: '0.8rem', lineHeight: '1.5' }}>
                {generatedContract}
              </pre>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>⚡</div>
            <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '6px' }}>AI Generated</div>
            <div style={{ fontSize: '0.9rem', color: '#888' }}>Smart contract in seconds</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🔒</div>
            <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '6px' }}>Verified</div>
            <div style={{ fontSize: '0.9rem', color: '#888' }}>Open source standard</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>💰</div>
            <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '6px' }}>Low Gas</div>
            <div style={{ fontSize: '0.9rem', color: '#888' }}>Deploy on BSC</div>
          </div>
        </div>

        <footer style={{ padding: '30px 0', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>AI Creator Hub © 2024</p>
        </footer>
      </div>
    </div>
  )
}
