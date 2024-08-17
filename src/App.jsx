import React, { useState } from 'react';
import './App.css';
import TodoList from './components/todolist';
import Login from './components/Login';
import Register from './components/Register';
import { Button } from 'antd';
const App = () => {
const [user, setUser] = useState(null);

const handleLogout = () => {
localStorage.removeItem('token');
setUser(null);
};

return (
<div>
<h1 className='header'>Todo List</h1>
{!user ? (
<>
<Login setUser={setUser} />
<Register />
</>
) : (
<>
<TodoList user={user} />
<Button onClick={handleLogout}>Logout</Button>
</>
)}
</div>
);
};
export default App;