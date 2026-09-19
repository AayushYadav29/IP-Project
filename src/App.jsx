import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ImageProvider } from './context/ImageContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Restore from './pages/Restore'
import Compare from './pages/Compare'
import History from './pages/History'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <ImageProvider>
        <div className="app-container">
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restore" element={<Restore />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </ImageProvider>
    </BrowserRouter>
  )
}

export default App
