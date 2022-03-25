import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { todoService } from './todos.service';
todoService;
@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: todoService) {}
  @Post()
  addTodo(@Body('name') todoName: string): any {
    const id = this.todoService.insertTodo(todoName);
    return {
      id,
      code: 201,
      status: 'success',
      message: 'Successfuilly added',
    };
  }
  @Get()
  getAllTodos() {
    return this.todoService.getTodos();
  }

  @Get(':id')
  getTodo(@Param('id') todoId: string) {
    return this.todoService.getSinglieTodo(Number(todoId));
  }

  @Patch(':id')
  updateTodo(@Param('id') todoId: string, @Body('name') todoName: string) {
    this.todoService.updateTodo(Number(todoId), todoName);

    return {
      statusCode: 200,
      message: 'Successfully updated',
    };
  }
  @Delete(':id')
  deleteTodo(@Param('id') todoId: string) {
    this.todoService.deleteTodo(Number(todoId));
    return {
      statusCode: 200,
      message: 'Successfully deleted',
    };
  }
}
