import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LogingPage'
import SignUpPage from './pages/SignUpPage'
import AboutPage from './components/about/AboutPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <LoginPage/> */}
      {/* <SignUpPage/> */}
      <AboutPage/>
    </>
  )
}

export default App
