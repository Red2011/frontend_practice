import {Module} from "@nestjs/common";
import {TodoController} from "./todo.controller";
import {TodoService} from "./todo.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Todo, TodoSchema} from "./schemas/todo.schema";
import {Priority, PrioritySchema} from "./schemas/priority.schemas";
import {Mark} from "./schemas/mark.schemas";


@Module({
    imports: [
      MongooseModule.forFeature([{name: Todo.name, schema: TodoSchema}]),
      MongooseModule.forFeature([{name: Priority.name, schema: PrioritySchema}]),
      MongooseModule.forFeature([{name: Mark.name, schema: TodoSchema}])
    ],
    controllers: [TodoController],
    providers: [TodoService]
})

export class TodoModule{

}
