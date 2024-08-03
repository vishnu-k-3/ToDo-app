import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Components/Header';
import Form from './Components/Form';
import TodoList from './Components/TodoList';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

const App = () => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos/`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (title) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos/`, {
        title,
        completed: false,
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id, title, completed) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, {
        title,
        completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className='container'>
      <div className='app-wrapper'>
        <div>
          <Header />
        </div>
        <div>
          <Form
            input={input}
            setInput={setInput}
            todos={todos}
            setTodos={setTodos}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
            addTodo={addTodo}
            updateTodo={updateTodo}
          />
        </div>
        <div>
          <TodoList
            todos={todos}
            setTodos={setTodos}
            setEditTodo={setEditTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default App;