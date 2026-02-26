import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import FindWork from './pages/FindWork.jsx'
import About from './pages/About.jsx'
import FindFreelancers from './pages/FindFreelancers.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import { DarkModeProvider } from './components/navbar/NavbarComponent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/findfreelan" element={<FindFreelancers />} />
            <Route path="/findwork" element={<FindWork />} />
            <Route path="/" element={<App />} />
          </Route>
        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  </StrictMode>,
)
