import React from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const TodoList = ({ todos, setTodos, setEditTodo }) => {
    const handleComplete = (todo) => {
        setTodos(
            todos.map((item) => {
                if (item._id === todo._id) {
                    return { ...item, completed: !item.completed }
                }
                return item;
            })
        );
    };

    const handleEdit = (todo) => {
        setEditTodo(todo);
    };

    const handleDelete = async (todo) => {
        try {
            await axios.delete(`${API_BASE_URL}/todos/${todo._id}`);
            setTodos(todos.filter((item) => item._id !== todo._id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div>
            {todos.map((todo) => (
                <li className='list-item' key={todo._id}>
                    <input
                        type='text'
                        value={todo.title}
                        className={`list ${todo.completed ? 'complete' : ''}`}
                        onChange={(event) => event.preventDefault()}
                    />
                    <div>
                        <button
                            className='button-complete task-button'
                            onClick={() => handleComplete(todo)}
                        >
                            <i className='fa fa-check-circle'></i>
                        </button>
                        <button
                            className='button-edit task-button'
                            onClick={() => handleEdit(todo)}
                        >
                            <i className='fa fa-edit'></i>
                        </button>
                        <button
                            className='button-delete task-button'
                            onClick={() => handleDelete(todo)}
                        >
                            <i className='fa fa-trash'></i>
                        </button>
                    </div>
                </li>
            ))}
        </div>
    );
};

export default TodoList;
