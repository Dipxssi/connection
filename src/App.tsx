import { useState, useEffect } from 'react'
import PortfolioForm from './components/PortfolioForm'
import PortfolioViewer from './components/PortfolioViewer'
import ErrorBoundary from './components/ErrorBoundary'
import { useToast, ToastContainer } from './components/ToastContainer'
import './App.css'

type AppState = 'form' | 'viewing' | 'qr'

const STORAGE_PREFIX = 'connection_pitch_'

function App() {
  const [state, setState] = useState<AppState>('form')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [pitchText, setPitchText] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const { toasts, showToast, removeToast } = useToast()

  // Check URL parameters on load for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const portfolio = params.get('portfolio')
    const linkedin = params.get('linkedin')
    const pitchId = params.get('pitchId')
    
    if (portfolio && linkedin) {
      setPortfolioUrl(decodeURIComponent(portfolio))
      setLinkedinUrl(decodeURIComponent(linkedin))
      
      // Try to get pitch from localStorage using pitchId
      if (pitchId) {
        const storedPitch = localStorage.getItem(`${STORAGE_PREFIX}${pitchId}`)
        if (storedPitch) {
          setPitchText(storedPitch)
          setState('viewing')
          return
        }
      }
      
      // Fallback: try old URL parameter format
      const pitch = params.get('pitch')
      if (pitch) {
        try {
          const decodedPitch = decodeURIComponent(pitch)
          setPitchText(decodedPitch)
          setState('viewing')
        } catch (e) {
          showToast('Error loading pitch text. Please create a new connection.', 'error')
        }
      }
    }
  }, [showToast])

  const handlePortfolioSubmit = (url: string, linkedin: string, pitch: string) => {
    setPortfolioUrl(url)
    setLinkedinUrl(linkedin)
    setPitchText(pitch)
    
    // Generate unique ID for pitch text
    const pitchId = Math.random().toString(36).substring(2, 15)
    
    // Store pitch text in localStorage
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${pitchId}`, pitch)
      
      // Clean up old entries (keep only last 10)
      const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .sort()
      if (keys.length > 10) {
        keys.slice(0, keys.length - 10).forEach(key => localStorage.removeItem(key))
      }
    } catch (e) {
      console.error('Failed to store pitch in localStorage:', e)
      showToast('Warning: Could not save pitch text locally. URL may be too long.', 'error')
    }
    
    // Generate shareable URL with pitchId instead of full pitch text
    const baseUrl = window.location.origin + window.location.pathname
    const shareableUrl = `${baseUrl}?portfolio=${encodeURIComponent(url)}&linkedin=${encodeURIComponent(linkedin)}&pitchId=${pitchId}`
    setShareUrl(shareableUrl)
    setState('qr')
    showToast('QR code generated successfully!', 'success')
  }

  const handleViewPortfolio = () => {
    setState('viewing')
  }

  return (
    <ErrorBoundary>
      <div className="app">
        {state === 'form' && (
          <PortfolioForm 
            onSubmit={handlePortfolioSubmit}
            onToast={showToast}
          />
        )}
        {state === 'qr' && (
          <PortfolioForm 
            onSubmit={handlePortfolioSubmit}
            showQR={true}
            shareUrl={shareUrl}
            portfolioUrl={portfolioUrl}
            linkedinUrl={linkedinUrl}
            pitchText={pitchText}
            onViewPortfolio={handleViewPortfolio}
            onToast={showToast}
          />
        )}
        {state === 'viewing' && (
          <PortfolioViewer 
            portfolioUrl={portfolioUrl}
            linkedinUrl={linkedinUrl}
            pitchText={pitchText}
          />
        )}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  )
}

export default App

