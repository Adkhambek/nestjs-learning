import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { todoService } from './todos.service';

@Module({
  controllers: [TodosController],
  providers: [todoService],
})
export class TodosModule {}
