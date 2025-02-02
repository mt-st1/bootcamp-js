/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent('event'));
  }

  subscribe(subscriber) {
    this.addEventListener('event', subscriber);
  }
}

/**
 * Action Creator and Action Types
 */
const FETCH_TODO_ACTION_TYPE = 'Fetch todo list from server';
export const createFetchTodoListAction = () => ({
  type: FETCH_TODO_ACTION_TYPE,
  payload: undefined,
});

// addTodoParam: { name: string }
const ADD_TODO_ACTION_TYPE = 'Add todo';
export const createAddTodoAction = (addTodoParam) => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: addTodoParam,
});

// updateTodoParam: { id: number, name: string, done: boolean }
const UPDATE_TODO_ACTION_TYPE = 'Update todo';
export const createUpdateTodoAction = (updateTodoParam) => ({
  type: UPDATE_TODO_ACTION_TYPE,
  payload: updateTodoParam,
});

// deleteTodoParam: { id: number }
const DELETE_TODO_ACTION_TYPE = 'Delete todo';
export const createDeleteTodoAction = (deleteTodoParam) => ({
  type: DELETE_TODO_ACTION_TYPE,
  payload: deleteTodoParam,
});

const CLEAR_ERROR = 'Clear error from state';
export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: undefined,
});

/**
 * Store Creator
 */
const api = 'http://localhost:3000/todo';

const defaultState = {
  todoList: [],
  error: null,
};

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
};

const reducer = async (prevState, { type, payload }) => {
  switch (type) {
    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then((d) => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case ADD_TODO_ACTION_TYPE: {
      console.log('ADD_TODO_ACTION is dispatched!');
      const body = JSON.stringify(payload);
      const params = { method: 'POST', headers, body };
      try {
        const addedTodo = await fetch(api, params).then((d) => d.json());
        return { todoList: [...prevState.todoList, addedTodo], error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case UPDATE_TODO_ACTION_TYPE: {
      console.log('UPDATE_TODO_ACTION is dispatched!');
      const { id, name, done } = payload;
      const newTodoList = prevState.todoList.map((todo) =>
        todo.id === id ? { ...todo, done } : todo
      );
      const body = JSON.stringify({ name, done });
      const params = { method: 'PATCH', headers, body };
      try {
        const updatedTodo = await fetch(`${api}/${id}`, params).then((d) =>
          d.json()
        );
        return { todoList: newTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case DELETE_TODO_ACTION_TYPE: {
      console.log('DELETE_TODO_ACTION is dispatched!');
      const { id } = payload;
      const newTodoList = prevState.todoList.filter((todo) => todo.id !== id);
      const params = { method: 'DELETE' };
      try {
        const res = await fetch(`${api}/${id}`, params);
        return { todoList: newTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error('unexpected action type: %o', { type, payload });
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async ({ type, payload }) => {
    console.group(type);
    console.log('prev', state);
    state = await reducer(state, { type, payload });
    console.log('next', state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe,
  };
}
