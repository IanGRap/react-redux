import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze'

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				{
					id: action.id,
					text: action.text,
					completed: false
				}
			];
		case 'TOGGLE_TODO':
			return state.map(todo => {
				if(todo.id !== action.id){
					return todo;
				}

				return {
					... todo,
					completed: !todo.completed
				}
			});
			return [
				...state.slice(0, action.id),
				{
					...state[action.id],
					completed: !state[action.id].completed
				},
				...state.slice(action.id + 1)
			];
		default:
			return state;
	}
}

const testTodos = () => {
	const stateBefore = [];

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

const testToggleTodos = () => {
	const stateBefore = [
		{
			id: 0,
			text: 'Learn redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: false
		}
	];

	const action = {
		id: 1,
		type: 'TOGGLE_TODO'
	};

	const stateAfter = [
		{
			id: 0,
			text: 'Learn redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: true
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
}

testTodos();
testToggleTodos();

const toggleToDo = (todo) => {
	return {
		...todo,
		completed: !todo.completed
	};
}

console.log('tests passed!');





