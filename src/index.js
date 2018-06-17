import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { combineReducers } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze'
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { DragSource } from 'react-dnd';
//import { ItemTypes } from './Constants';

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
				completed: !state.completed
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
			return action.filter;
		default:
			return state;
	}
}

const sortingFilter = (state = 'NONE', action) => {
	switch(action.type){
		case 'SET_SORTING_FILTER':
			return action.filter;
		default:
			return state;
	}
}

let todoAppId = 0;
const addTodo = (text) => {
	return {
		id: todoAppId++,
		type:  'ADD_TODO',
		text
	}
}

const setVisibilityFilter = (props) => {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter: props.filter
	};
}

const toggleTodo = (id) => {
	return {
		type: 'TOGGLE_TODO',
		id
	}
}

const setSortingFilter = (props) => {
	return {
		type: 'SET_SORTING_FILTER',
		filter: props.filter
	}
}

const todoApp = combineReducers({
	todos,
	visibilityFilter,
	sortingFilter
});

const Link = ({
	active,
	onClick,
	children
}) => {
	if(active){
		return <span> {children} </span>;
	}
	return <a href = '#' 
		onClick = {e => {
			e.preventDefault();
			onClick();
		}}>
			{children}
		</a>
}

const mapStateToFilterLinkProps = (
	state,
	ownProps
) => {
	return({
		active:
			ownProps.filter ===
			state.visibilityFilter
	});
}
const mapDispatchToFilterLink = (
	dispatch,
	ownProps
) => {
	return({
		onClick: () => 
			dispatch(setVisibilityFilter(ownProps))
	});
}
const FilterLink = connect (
	mapStateToFilterLinkProps,
	mapDispatchToFilterLink
)(Link);

const Todo = ({
	onClick,
	completed,
	text
}) => (
	<li
		onClick = { onClick }
		style = {{
			textDecoration: completed ?
				'line-through' :
				'none'
		}}
	>
		{text}
	</li>
)

const TodoList = ({
	todos,
	onTodoClick
}) => (
	<ul>
		{todos.map(todo => 
			<Todo
				key = {todo.id}
				{...todo}
				onClick = { () => onTodoClick(todo.id) }
			/>
		)}
	</ul>
);

let AddTodo = ({dispatch}) => {
	let input;
	return (<div>
		<input ref = {node =>{
			input = node;
		}} />
		<button onClick = {() =>{
			dispatch(addTodo(input.value));
			input.value = '';
		}}>
			add todo
		</button>
	</div>);
};
AddTodo = connect()(AddTodo);

const Footer = () => (
	<p>
		Show
		<FilterLink 
			filter = 'SHOW_ALL'
		>
			All
		</FilterLink>
		{', '}
		<FilterLink 
			filter = 'SHOW_COMPLETED'
		>
			Completed
		</FilterLink>
		{', '}
		<FilterLink 
			filter = 'SHOW_ACTIVE'
		>
			Active
		</FilterLink>
	</p>
);

const mapStateToToDoListProps = (state) => {
	let todos = getVisibleTodos(
		state.visibilityFilter,
		state.todos
	);
	todos = sortTodos(
		state.sortingFilter,
		todos
	);
	return ({
		todos
	});
}
const mapDispatchToToDoListProps = (dispatch) => {
	return ({
		onTodoClick: (id) => {
			dispatch(toggleTodo(id));
		}
	});
}
const VisibleTodoList = connect(
	mapStateToToDoListProps,
	mapDispatchToToDoListProps
)(TodoList);

const TodoApp = ({
	store
}) => (
	<div>
		<AddTodo />
		<VisibleTodoList />
		<Footer />
	</div>
);

const getVisibleTodos = (
	filter,
	todos
) => {
	switch(filter){
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_ACTIVE':
			return todos.filter( todo => !todo.completed);
		case 'SHOW_COMPLETED':
			return todos.filter( todo => todo.completed);
		default:
			return todos;
	}
}

const sortTodos = (
	filter,
	todos
) => {
	switch(filter){
		case 'ALPHABETICAL':
			return todos.sort( (a, b) => {
				console.log('a: ');
				console.log(a);
				console.log('b: ');
				console.log(b);
				return a.text - b.text;
			});
		case 'CREATED':
			return todos;
		default:
			console.log('before sort:');
			console.log(todos);
			todos.sort( (a, b) => {
				console.log('default');
				console.log('a: ');
				console.log(a);
				console.log('b: ');
				console.log(b);
				console.log('a.text:');
				console.log(a.text);
				let value = a.text > b.text;
				console.log('value:');
				console.log(value);
				return value;
			});
			console.log('after sort:');
			console.log(todos);
			return todos;
	}
}
	
ReactDOM.render(
	<Provider store = {createStore(todoApp)} >
		<TodoApp />
	</Provider>,
	document.getElementById('root')
);




