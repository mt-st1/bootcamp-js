import { createFetchTodoListAction, clearError } from './flux/index.js';
import store from './store.js';
import TodoList from './components/todo-list.js';
import TodoForm from './components/todo-form.js';
import DoneItemsNum from './components/done-items-num.js';

new TodoForm().mount();

store.subscribe((state) => {
  if (state.error == null) {
    const parent = document.querySelector('.todo-list__wrapper');
    new TodoList(parent, { todoList: state.todoList }).render();
    new DoneItemsNum(
      state.todoList.filter((todo) => todo.done).length
    ).render();
  } else {
    console.error(state.error);
    alert(state.error);
    store.dispatch(clearError());
  }
});

// アプリケーション起動時に一覧取得するための Action を dispatch
store.dispatch(createFetchTodoListAction());
