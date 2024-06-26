import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import GoogleSheet from './GoogleSheet';

const App = () => {
  const [token, setToken] = useState(null);

  if (!token) {
    return (
      <>
        <Login setToken={setToken} />
        <Register />
      </>
    );
  }
};

export default App;
