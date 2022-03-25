import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todos.model';

@Injectable()
export class todoService {
  private todos: Todo[] = [];
  insertTodo(name: string) {
    const id = this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 1;
    const newProduct = new Todo(id, name, new Date().toString());
    this.todos.push(newProduct);
    return id;
  }
  getTodos() {
    return [...this.todos];
  }
  getSinglieTodo(todoId: number) {
    return this.findTodo(todoId).todo;
  }
  updateTodo(todoId: number, todoName: string) {
    const { todo, todoIndex } = this.findTodo(todoId);
    const updatedTodo = { ...todo };
    if (todoName) {
      updatedTodo.name = todoName;
      updatedTodo.date = new Date().toString();
    }
    this.todos[todoIndex] = updatedTodo;
  }
  deleteTodo(todoId: number) {
    const index = this.findTodo(todoId).todoIndex;
    this.todos.splice(index, 1);
  }

  private findTodo(id: number) {
    const todoIndex = this.todos.findIndex((val) => val.id === id);
    const todo = this.todos[todoIndex];
    if (!todo) throw new NotFoundException('Could not find todo');
    return { todo, todoIndex };
  }
}
