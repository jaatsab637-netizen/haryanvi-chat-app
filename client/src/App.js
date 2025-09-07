import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Chat from './Chat';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (tkn) => {
    setToken(tkn);
    localStorage.setItem('token', tkn);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/chat"
          element={
            token ? <Chat token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;