import React, { useState, useEffect } from 'react';
import Auth from './Auth';
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
    return <Auth setToken={setToken} />;
  }

  return (
    <div>
      <GoogleSheet />
    </div>
  );
};

export default App;
