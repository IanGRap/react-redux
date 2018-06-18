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
				due_date: action.due_date,
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

const sortingFilter = (state = 'CREATED', action) => {
	switch(action.type){
		case 'SET_SORTING_FILTER':
			return action.filter;
		default:
			return state;
	}
}

let todoAppId = 0;
const addTodo = (text, date) => {
	return {
		id: todoAppId++,
		type:  'ADD_TODO',
		due_date: date,
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

const Todo = ({
	onClick,
	completed,
	text,
	due_date
}) => {
	let description_text = <span>{text + ' '}</span>;
	let date_text = due_date !== undefined?
		<span>Due: {due_date}</span>:
		undefined;
	return <li
		onClick = { onClick }
		style = {{
			textDecoration: completed ?
				'line-through' :
				'none'
		}}
	>
		{description_text}
		{date_text}
	</li>;
}

let AddTodo = ({dispatch}) => {
	let text_input;
	let date_input;
	return (<div>
		<input ref = {node =>{
			text_input = node;
		}} />
		<input ref = {node =>{
			date_input = node;
		}} />
		<button onClick = {() =>{
			if(text_input.value !== ''){
				if(date_input.value  === '')
					dispatch(addTodo(text_input.value, undefined));
				else
					dispatch(addTodo(text_input.value, date_input.value));
				text_input.value = '';
				date_input.value = '';
			}
		}}>
			add todo
		</button>
	</div>);
};
AddTodo = connect()(AddTodo);

// Links
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
		}}
	>
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

const Button = ({
	active,
	onClick,
	children
}) => {
	if(active){
		return <span>{children}</span>
	}
	return <a href = '#'
		onClick = {e => {
			e.preventDefault();
			onClick();
		}}
	>
		{children}
	</a>
	// return <span
	// 	onClick = {() => {
	// 		onClick();
	// 	}}
	// 	style = {{
	// 		color: active?
	// 			'red':
	// 			'black'
	// 	}}
	// >
	// 		{children}
	// </span>
}
const mapStateToSortButton = (
	state,
	ownProps
) => {
	return({
		active:
			ownProps.filter ===
			state.sortingFilter
	});
}
const mapDispatchToSortButton = (
	dispatch,
	ownProps
) => {
	return({
		onClick: () => 
			dispatch(setSortingFilter(ownProps))
	});
}
const SortButton = connect(
	mapStateToSortButton,
	mapDispatchToSortButton
)(Button);

const SortDropdown = () => (
	<div>
		<span>Sort by</span>
		<SortButton
			filter = 'CREATED'
		>
			Created
		</SortButton>
		<SortButton
			filter = 'ALPHABETICAL'
		>
			Alphabetical
		</SortButton>
	</div>
);

//todo list
const TodoList = ({
	visibletodos,
	onTodoClick
}) => (
	<ul>
		{
			visibletodos.map(todo => 
			<Todo
				key = {todo.id}
				{...todo}
				onClick = { () => onTodoClick(todo.id) }
			/>
		)}
	</ul>
);
const mapStateToToDoListProps = (state) => {
	let visibletodos = getVisibleTodos(
		state.visibilityFilter,
		state.todos
	);
	visibletodos = sortTodos(
		state.sortingFilter,
		visibletodos
	);
	return ({
		visibletodos
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
		<SortDropdown />
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
				return a.text > b.text;
			});
		case 'CREATED':
			return todos.sort( (a,b) => {
				return a.id < b.id;
			});
		default:
			return todos;
	}
}
	
ReactDOM.render(
	<Provider store = {createStore(todoApp)} >
		<TodoApp />
	</Provider>,
	document.getElementById('root')
);




