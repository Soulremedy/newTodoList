import React, { useState } from 'react';
import { Input, Button, message } from 'antd';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      setUser({ username, token: data.token });
    } else {
      message.error('Login failed');
    }
  };

  return (
    <div>
      <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;