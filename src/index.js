import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze'

const counter = (state = 0, action) => {
	if (action.type === 'increment'){
		console.log('incrementing state');
		return state + 1;
	} else if (action.type === 'decrement'){
		console.log('decrementing state');
		return state - 1;
	} else {
		return state;
	}
}

const Counter = ({value, onIncrement, onDecrement}) => (
	<div>
		<h1>{value}</h1>
		<button onClick = {onIncrement}>+</button>
		<button onClick = {onDecrement}>-</button>
	</div>
);

const store = createStore(counter);

const render = () => {
	ReactDOM.render(
		<Counter 
			value = { store.getState()}
			onIncrement = { () =>
				store.dispatch({ type: 'increment' })
			}
			onDecrement = { () =>
				store.dispatch({ type: 'decrement' })
			}
		/>,
		document.getElementById('root')
	);
}

store.subscribe(render);
render();

const addCounter = (list) => {
	return [...list, 0];
}

const removeCounter = (list, index) => {
	return [
		...list.slice(0, index),
		...list.slice(index + 1)
	];
}

const incrementCounter = (list, index) => {
	return [
		...list.slice(0, index),
		list[index],
		...list.slice(index + 1)
	];
}

const toggleToDo = (todo) => {
	return {
		...todo,
		completed: !todo.completed
	};
}

const testToggleToDo = () => {

	const toDoBefore = {
		id: 0,
		text: 'learn redux',
		completed: true
	};

	const toDoAfter = {
		id: 0,
		text: 'learn redux',
		completed: false
	};

	deepFreeze(toDoBefore);

	expect(
		toggleToDo(toDoBefore)
	).toEqual(toDoAfter);
}

testToggleToDo();
console.log('tests passed!');





