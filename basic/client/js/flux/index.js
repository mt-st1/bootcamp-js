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
  paylaod: undefined,
});

// addTodoParam: { name: string }
const ADD_TODO_ACTION_TYPE = 'Add todo';
export const createAddTodoAction = (addTodoParam) => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: addTodoParam,
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
      console.log(prevState);
      try {
        const addedTodo = await fetch(api, params).then((d) => d.json());
        return { todoList: [...prevState.todoList, addedTodo], error: null };
      } catch (err) {
        console.error(err);
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
