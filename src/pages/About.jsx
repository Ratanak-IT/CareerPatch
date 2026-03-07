import React from 'react'
import AboutPage from '../components/about/AboutPage'
import ContactPage from './ContactPage'

export default function About() {
  return (
    <>
    <AboutPage/>
    <div id='contact'>
    <ContactPage/>
    </div>
    </>
  )
}
