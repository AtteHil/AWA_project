import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './i18n';

import Header from "./components/header"
import Login from "./components/login"
import Register from "./components/register"
import Cards from "./components/cards"
import Chats from "./components/chat"
import Profile from "./components/profile"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() { // basic app desing and routes route different connections to pages with right components


  return (
    <div className='background-image'>
      <Router>

        <Routes>
          <Route path='/Profile' element={<><Header /><Profile /></>}></Route>
          <Route path="/Swipe" element={<><Header /><Cards /></>}> </Route>
          <Route path="/" element={<Header />}></Route>
          <Route path="/chat" element={<><Header /><Chats /></>}></Route>
          <Route path="/login" element={<><Header /><Login /></>}></Route>
          <Route path="/register" element={<><Header /><Register /></>}></Route>
        </Routes>
      </Router>

    </div>
  )
}

export default App
