import React, { useState } from 'react';

const Auth = ({ setToken }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleToggle = () => {
    setIsRegister(!isRegister);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem(email));
    if (user && user.password === password) {
      setToken('fake-token');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = () => {
    if (localStorage.getItem(email)) {
      alert('User already exists');
    } else {
      localStorage.setItem(email, JSON.stringify({ password }));
      alert('Registration successful');
      setIsRegister(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <br />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={handleToggle}>
        {isRegister ? 'Already have an account? Login' : 'Don’t have an account? Register'}
      </button>
    </form>
  );
};

export default Auth;
