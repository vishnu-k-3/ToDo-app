import React, { useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'http://localhost:8000';

function Form({ input, setInput, todos, setTodos, editTodo, setEditTodo }) {
    const updateTodo = async (title, id, completed) => {
        try {
            console.log('Updating todo:', { title, id, completed });
            const response = await axios.put(`${API_BASE_URL}/todos/${id}`, {
                title,
                completed
            });
            const newTodo = todos.map((todo) =>
                todo._id === id ? response.data : todo
            );
            setTodos(newTodo);
            setEditTodo(null);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const onInputChange = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        if (editTodo) {
            setInput(editTodo.title);
        } else {
            setInput('');
        }
    }, [setInput, editTodo]);

    const onFormSubmit = async (event) => {
        event.preventDefault();
        if (!editTodo) {
            try {
                const response = await axios.post(`${API_BASE_URL}/todos/`, {
                    id: uuidv4(),
                    title: input,
                    completed: false
                });
                setTodos([...todos, response.data]);
                setInput("");
            } catch (error) {
                console.error('Error adding todo:', error);
            }
        } else {
            console.log('Edit todo ID:', editTodo._id);
            updateTodo(input, editTodo._id, editTodo.completed);
        }
    };

    return (
        <form onSubmit={onFormSubmit}>
            <input
                type="text"
                placeholder='Enter a Todo...'
                className='task-input'
                value={input}
                required
                onChange={onInputChange}
            />
            <button className='button-add' type='submit'>
                {editTodo ? 'OK' : 'Add'}
            </button>
        </form>
    );
}

export default Form;
