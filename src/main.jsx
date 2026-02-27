import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import FindWork from './pages/FindWork.jsx'
import About from './pages/About.jsx'
import FindFreelancers from './pages/FindFreelancers.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import Register from './pages/Register.jsx'
import { DarkModeProvider } from './components/navbar/NavbarComponent.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import LoginPage from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import { setupListeners } from '@reduxjs/toolkit/query'
setupListeners(store.dispatch);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <React.StrictMode>
         <Provider store={store}>
    <BrowserRouter>
      <DarkModeProvider>
        <Routes>
          <Route element={<RootLayout />}>

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/findfreelan" element={<FindFreelancers />} />
            <Route path="/findwork" element={<FindWork />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />

          </Route>
        </Routes>
      </DarkModeProvider>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
    </Provider>
    </React.StrictMode>
  </StrictMode>,
)