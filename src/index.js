import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze'

const todo = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if(state.id !== action.id){
				return state;
			}

			return {
				... state,
				completed: !todo.completed
			}
		default:
			return state;
	}
}

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				todo(undefined, action)
			];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;
	}
}

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch(action.type){
		case 'SET_VISIBILITY_FILTER':
			return action.type;
		default:
			return state;
	}
}

const todoApp = combineReducers({
	todos,
	visibilityFilter
});

const store = createStore(todoApp);

// console.log(store.getState());
// store.dispatch({
// 	id: 0,
// 	text: 'learn react and redux',
// 	type: 'ADD_TODO'
// });
// console.log(store.getState());

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





