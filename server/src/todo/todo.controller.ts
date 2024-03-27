import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {TodoService} from "./todo.service";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {ObjectId, SortOrder} from "mongoose";
import {Todo} from "./schemas/todo.schema";


@Controller('/todos')
export class TodoController{
    constructor(private todoService: TodoService) { }

    @Post() //передам в json
    createTodo(@Body() dto: CreateTodoDto){
        return this.todoService.createTodo(dto);
    }

    @Get() //передаём в параметре /?count=2
    getAllTodos(@Query('count') count: number,
           @Query('offset') offset: number,
                @Query('date_sort') date_sort?: SortOrder,
                @Query('priority') priority?: ObjectId[],
                @Query('marks') marks?: ObjectId[]) {
        return this.todoService.getAllTodos(count, offset, date_sort, priority, marks);
    }

    @Get('/priority')
    getAllPriorities(){
        return this.todoService.getAllPriorities();
    }

    @Get('/mark')
    getAllMarks() {
        return this.todoService.getAllMarks();
    }

    @Get(':id') //то что после слеша
    getOneTodo(@Param('id') id: ObjectId) {
        return this.todoService.getOneTodo(id);
    }

    @Put(':id')
    updateTodo(@Param('id') id: ObjectId,
               @Body() updatedTodoData: Partial<Todo>){
        return this.todoService.updateTodo(id, updatedTodoData);
    }

    @Delete(':id')
    deleteTodo(@Param('id') id: ObjectId) {
        return this.todoService.deleteTodo(id);
    }

}
