import store from '../store.js';
import {
  createDeleteTodoAction,
  createUpdateTodoAction,
} from '../flux/index.js';

class Todo {
  constructor(parent, { id, name, done }) {
    this.parent = parent;
    this.props = { id, name, done };
    this.mounted = false;
  }

  mount() {
    if (this.mounted) return;
    // TODO: ここにTODOの削除ボタンが押されたときの処理を追記
    // TODO: ここにTODOのチェックボックスが押されたときの処理を追記
    const todoCheckboxElem = this.element.querySelector('input.todo-toggle');
    todoCheckboxElem.addEventListener('change', () => {
      console.log('Checkbox toggled!!');
      const { id, name, done } = this.props;
      store.dispatch(createUpdateTodoAction({ id, name, done: !done }));
    });
    const todoRemoveButtonElem = this.element.querySelector(
      'div.todo-remove-button'
    );
    todoRemoveButtonElem.addEventListener('click', () => {
      console.log('Remove button clicked!!!');
      const { id } = this.props;
      store.dispatch(createDeleteTodoAction({ id }));
    });
    this.mounted = true;
  }

  render() {
    const { id, name, done } = this.props;
    const next = document.createElement('li');
    next.className = 'todo-item';
    next.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done ? 'checked' : ''}
        />
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${name}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `;
    if (!this.element) {
      this.parent.appendChild(next);
    } else {
      this.parent.replaceChild(this.element, next);
    }
    this.element = next;
    this.mount();
  }
}

export default Todo;
