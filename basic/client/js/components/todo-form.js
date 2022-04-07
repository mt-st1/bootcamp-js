import store from '../store.js';
import { createAddTodoAction } from '../flux/index.js';

class TodoForm {
  constructor() {
    this.button = document.querySelector('.todo-form__submit');
    this.form = document.querySelector('.todo-form__input');
  }

  mount() {
    // TODO:
    // ここに 作成ボタンが押されたら todo を作成するような処理を追記する
    this.button.addEventListener('click', () => {
      console.log('clicked!');
      const todoName = this.form.value;
      if (todoName) {
        store.dispatch(createAddTodoAction({ name: todoName }));
      }
    });
  }
}

export default TodoForm;
