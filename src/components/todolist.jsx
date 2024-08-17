import React, { useState, useEffect } from 'react';
import { Input, Button, List, DatePicker, message } from 'antd';
import moment from 'moment';

const TodoList = ({ user }) => {
const [todos, setTodos] = useState([]);
const [newTodo, setNewTodo] = useState('');
const [newDeadline, setNewDeadline] = useState('');

const fetchTodos = async () => {
const response = await fetch('http://localhost:5000/todos?token=' + user.token);
const data = await response.json();
setTodos(data);
};

useEffect(() => {
fetchTodos();
}, []);

const handleAddTodo = async () => {
if (!newTodo.trim() || !newDeadline.trim()) {
message.error('请输入待办事项和截止日期');
return;
}
const response = await fetch('http://localhost:5000/todos', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ token: user.token, text: newTodo, deadline: moment(newDeadline).format('YYYY-MM-DD') }),
});
if (response.ok) {
fetchTodos();
setNewTodo('');
setNewDeadline('');
}
};

const handleToggleTodo = async index => {
const todo = todos[index];
const response = await fetch('http://localhost:5000/todos', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ token: user.token, id: todo.id, completed: !todo.completed }),
});
if (response.ok) fetchTodos();
};

const handleDeleteTodo = async index => {
const todo = todos[index];
await fetch('http://localhost:5000/todos', {
method: 'DELETE',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ token: user.token, id: todo.id }),
});
fetchTodos();
};

const currentDate = moment().format('YYYY-MM-DD');

return (
<div>
<Input
value={newTodo}
onChange={e => setNewTodo(e.target.value)}
placeholder="To-do list"
/>
<DatePicker
value={newDeadline ? moment(newDeadline) : null}
onChange={date => setNewDeadline(date ? date.format('YYYY-MM-DD') : '')}
placeholder="Select deadline"
style={{ marginBottom: '1rem' }}
/>
<Button onClick={handleAddTodo}>Add Item</Button>
<List
dataSource={todos}
renderItem={(todo, index) => (
<List.Item
style={{
color: todo.deadline < currentDate ? 'red' : 'initial',
}}
>
<span
style={{
textDecoration: todo.completed ? 'line-through' : 'none',
}}
>
{todo.text} - deadline: {todo.deadline}
</span>
<Button onClick={() => handleToggleTodo(index)}>
{todo.completed ? 'Unfinished' : 'Completed'}
</Button>
<Button onClick={() => handleDeleteTodo(index)}>Delete</Button>
</List.Item>
)}
/>
</div>
);
};

export default TodoList;