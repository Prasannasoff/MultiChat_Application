import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChatRoom from './Component/ChatRoom'
import LoginPage from './Component/LoginPage'
import RegisterPage from './Component/RegisterPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/publicChat' element={<ChatRoom />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App