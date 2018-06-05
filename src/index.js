import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze'

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			console.log('adding todo');
			return [
				...state,
				{
					id: action.id,
					text: action.text,
					completed: false
				}
			];
		default:
			console.log("default");
			return state;
	}
}

const testTodos = () => {
	const stateBefore = {};

	const action = {
		id: 0,
		type: 'ADD_TODO',
		text: 'Learn redux'
	};

	const stateAfter = [
		{
			id: 0,
			text: 'Learn redux',
			completed: false
		}
	];

	deepFreeze(stateBefore);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
}

testTodos();

const toggleToDo = (todo) => {
	return {
		...todo,
		completed: !todo.completed
	};
}

console.log('tests passed!');





