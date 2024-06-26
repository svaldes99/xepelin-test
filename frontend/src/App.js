import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import GoogleSheet from './GoogleSheet';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  if (!token) {
    return (
      <div>
        <Login setToken={setToken} />
        <Register />
      </div>
    );
  }

  return (
    <div>
      <GoogleSheet />
    </div>
  );
};

export default App;
