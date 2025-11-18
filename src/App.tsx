import { useState, useEffect } from 'react'
import PortfolioForm from './components/PortfolioForm'
import PortfolioViewer from './components/PortfolioViewer'
import './App.css'

type AppState = 'form' | 'viewing' | 'qr'

function App() {
  const [state, setState] = useState<AppState>('form')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [shareUrl, setShareUrl] = useState('')

  // Check URL parameters on load for shareable links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const portfolio = params.get('portfolio')
    const linkedin = params.get('linkedin')
    
    if (portfolio && linkedin) {
      setPortfolioUrl(decodeURIComponent(portfolio))
      setLinkedinUrl(decodeURIComponent(linkedin))
      setState('viewing')
    }
  }, [])

  const handlePortfolioSubmit = (url: string, linkedin: string) => {
    setPortfolioUrl(url)
    setLinkedinUrl(linkedin)
    
    // Generate shareable URL
    const baseUrl = window.location.origin + window.location.pathname
    const shareableUrl = `${baseUrl}?portfolio=${encodeURIComponent(url)}&linkedin=${encodeURIComponent(linkedin)}`
    setShareUrl(shareableUrl)
    setState('qr')
  }

  const handleViewPortfolio = () => {
    setState('viewing')
  }

  return (
    <div className="app">
      {state === 'form' && (
        <PortfolioForm onSubmit={handlePortfolioSubmit} />
      )}
      {state === 'qr' && (
        <PortfolioForm 
          onSubmit={handlePortfolioSubmit}
          showQR={true}
          shareUrl={shareUrl}
          portfolioUrl={portfolioUrl}
          linkedinUrl={linkedinUrl}
          onViewPortfolio={handleViewPortfolio}
        />
      )}
      {state === 'viewing' && (
        <PortfolioViewer 
          portfolioUrl={portfolioUrl}
          linkedinUrl={linkedinUrl}
        />
      )}
    </div>
  )
}

export default App

