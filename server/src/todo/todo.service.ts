import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Todo, TodoDocument} from "./schemas/todo.schema";
import {Model, ObjectId, SortOrder} from "mongoose";
import {Priority, PriorityDocument} from "./schemas/priority.schemas";
import {Mark, MarkDocument} from "./schemas/mark.schemas";
import {CreateTodoDto} from "./dto/create-todo.dto";


export interface allMarks {
    size: number,
    marks: Mark[]
}

export interface allPriorities {
    size: number,
    priorities: Priority[]
}

export interface DelId {
    id: ObjectId
}



@Injectable()

export class TodoService{

    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(Priority.name) private priorityModel: Model<PriorityDocument>,
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>) {}
    async createTodo(dto: CreateTodoDto): Promise<Todo> {
        const todo = await this.todoModel.create({...dto})
        return todo;
    }


    async getAllTodos(count = 15, offset = 0, date_sort: SortOrder = -1, priority: ObjectId[], marks: ObjectId[]): Promise<Todo[]> {
        const filters:any = {}
        if (marks) filters.mark = { $in: marks}
        if (priority) filters.priority = {$in: priority}

        const todos = await this.todoModel.find(filters).sort({creation_date: Number(date_sort) as SortOrder}).populate(['priority', 'mark']).skip(Number(offset)).limit(Number(count));
        return todos;
    }

    async getOneTodo(id: ObjectId): Promise<Todo> {
        const todo = await this.todoModel.findById(id).populate(['priority', 'mark']);
        return todo;
    }

    async deleteTodo(id: ObjectId): Promise<DelId> {
        const todo = await this.todoModel.findByIdAndDelete(id);
        return {id: todo.id};
    }

    async getAllPriorities(): Promise<allPriorities>{
        const priorities = await this.priorityModel.find();
        const size = await this.priorityModel.countDocuments();
        return {
            size: size,
            priorities: priorities
        };
    }

    async getAllMarks(): Promise<allMarks>{
        const marks = await this.markModel.find();
        const size = await this.markModel.countDocuments()
        return {
            size: size,
            marks: marks
        };
    }

    async updateTodo(id: ObjectId, updatedTodoData: Partial<Todo>): Promise<Todo> {
        const todo =  this.todoModel.findByIdAndUpdate(id, updatedTodoData, { new: true });
        return todo;
    }
}
