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

const sortingFilter = (state = 'NONE', action) => {
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
	date
}) => {
	let name = <span>{text + ' '}</span>;
	let date_text = undefined;
	if(date !== undefined)
		date_text = <span>Due Date</span>;
	return <li
		onClick = { onClick }
		style = {{
			textDecoration: completed ?
				'line-through' :
				'none'
		}}
	>
		{name}
		{date_text}
	</li>;
}

let AddTodo = ({dispatch}) => {
	let text_input;
	let day_input;
	let month_input;
	let year_input;
	let undefined_dates = 0;
	return (<div>
		<input ref = {node =>{
			text_input = node;
		}} />
		<button onClick = {() =>{
			dispatch(addTodo(text_input.value, undefined));
			text_input.value = '';
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

//todo list
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
				return a.text > b.text;
			});
		case 'CREATED':
			return todos;
		case 'DATE':
			return todos;
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




