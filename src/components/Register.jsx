import React, { useState } from 'react';
import { Input, Button, message } from 'antd';

const Register = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        setUser({ username, token: data.token });
      } else {
        message.error('注册失败');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      message.error('注册失败');
    });
  };

  return (
    <div>
      <Input 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        placeholder="Username" 
      />
      <Input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Password" 
      />
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;