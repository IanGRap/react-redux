import React, { Component } from 'react';
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

const todoApp = combineReducers({
	todos,
	visibilityFilter
});

const store = createStore(todoApp);

const FilterLink = ({
	filter,
	currentFilter,
	onClick,
	children
}) => {
	if(filter === currentFilter){
		return <span> {children} </span>;
	}
	return <a href = '#' 
		onClick = {e => {
			e.preventDefault();
			onClick(filter);
			// store.dispatch({
			// 	type: 'SET_VISIBILITY_FILTER',
			// 	filter
			// });
		}}>
			{children}
		</a>
}

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
		}}> 
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

const AddTodo = ({
	onAddClick
}) => {
	let input;
	console.log("in AddTodo");
	console.log("onAddClick: ");
	console.log(onAddClick);
	return (<div>
		<input ref = {node =>{
			input = node;
		}} />
		<button onClick = {() =>{
			onAddClick(input.value)
			input.value = '';
		}}>
			add todo
		</button>
	</div>);
};

const Footer = ({
	visibilityFilter,
	onFilterClick
}) => (
	<p>
		Show
		<FilterLink 
			filter = 'SHOW_ALL'
			currentFilter = {visibilityFilter}
			onClick = {onFilterClick}
		>
			All
		</FilterLink>
		{', '}
		<FilterLink 
			filter = 'SHOW_COMPLETED'
			currentFilter = {visibilityFilter}
			onClick = {onFilterClick}
		>
			Completed
		</FilterLink>
		{', '}
		<FilterLink 
			filter = 'SHOW_ACTIVE'
			currentFilter = {visibilityFilter}
			onClick = {onFilterClick}
		>
			Active
		</FilterLink>
	</p>
);

let todoAppId = 0;
const TodoApp = ({
	todos,
	visibilityFilter
}) => {
	<div>
		<AddTodo 
			onAddClick = {text =>
				store.dispatch({
					id: todoAppId++,
					type:  'ADD_TODO',
					text
				})
			}
		/>
		<TodoList
			todos = {getVisibleTodos(
				visibilityFilter,
				todos
			)}
			onTodoClick = {id => 
				store.dispatch({
					type: 'TOGGLE_TODO',
					id
				})
			}
		/>
		<Footer 
			visibilityFilter
			onFilterClick = { filter => 
				store.dispatch({
					type: 'SET_VISIBILITY_FILTER',
					filter
				})
			}
		/>
	</div>
}

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

const render = () => {
	ReactDOM.render(
		<TodoApp 
			{...store.getState()}
		/>,
		document.getElementById('root')
	);
};

store.subscribe(render);
render();




