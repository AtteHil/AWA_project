import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Text from "./components/text"
import Header from "./components/header"
import Login from "./components/login"
import Register from "./components/register"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() { // basic app desing and routes route different connections to pages wiuth right components
  

  return (
    <div>
      <Router>

        <Routes>
          <Route path="/about" element={<><Header /></>}> </Route>
          <Route path="/" element= {<><Header /><Text/></>}></Route>
          <Route path="/login" element={<><Header/><Login/></>}></Route>
          <Route path='/register' element={<><Header/><Register/></>}></Route>
        </Routes>
      </Router> 
        
  </div>
  )
}

export default App
