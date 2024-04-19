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


//декоратор помещающий класс - сервисом, для использования в других классах или компонентах
@Injectable()

export class TodoService{
    //логика обработки обращений к серверу


    //подключение необходимых моделей для каждого объекта (присвоение определенной структуры содержания объекта)
    constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(Priority.name) private priorityModel: Model<PriorityDocument>,
    @InjectModel(Mark.name) private markModel: Model<MarkDocument>) {}
    //создание новой задачи в соответствии с dto
    async createTodo(dto: CreateTodoDto): Promise<Todo> {
        const todo = await this.todoModel.create({...dto})
        return todo;
    }


    //получение всех задач, учитывая смещение количество, сортировку по дате, массиву меток и массиву приоритетов
    async getAllTodos(count = 15, offset = 0, date_sort: SortOrder = -1, priority: ObjectId[], marks: ObjectId[]): Promise<Todo[]> {
        const filters:any = {}
        //добавление в объект фильтров отметок и приоритетов, если они есть
        if (marks) filters.mark = { $in: marks}
        if (priority) filters.priority = {$in: priority}
        //find - отображение только конкретных значений
        //sort - сортировка по ключу с определенным значением
        //populate - отображение полных записей, связанных по внешним ключам
        //skip - пропуск первых х значений
        //limit - количество возвращаемых записей в запросе к бд
        const todos = await this.todoModel.find(filters).sort({creation_date: Number(date_sort) as SortOrder}).populate(['priority', 'mark']).skip(Number(offset)).limit(Number(count));
        return todos;
    }


    //получение записи по её первичному ключу
    async getOneTodo(id: ObjectId): Promise<Todo> {
        const todo = await this.todoModel.findById(id).populate(['priority', 'mark']);
        return todo;
    }


    //удаление записи по первичному ключу
    async deleteTodo(id: ObjectId): Promise<DelId> {
        const todo = await this.todoModel.findByIdAndDelete(id);
        return {id: todo.id};
    }


    //получение всех приоритетов в бд и размера коллекции приоритетов
    async getAllPriorities(): Promise<allPriorities>{
        const priorities = await this.priorityModel.find();
        const size = await this.priorityModel.countDocuments();
        return {
            size: size,
            priorities: priorities
        };
    }


    //получение всех отметок в бд и размера коллекции отметок
    async getAllMarks(): Promise<allMarks>{
        const marks = await this.markModel.find();
        const size = await this.markModel.countDocuments()
        return {
            size: size,
            marks: marks
        };
    }


    //обновление значений в конкретной записи по id
    async updateTodo(id: ObjectId, updatedTodoData: Partial<Todo>): Promise<Todo> {
        const todo =  this.todoModel.findByIdAndUpdate(id, updatedTodoData, { new: true });
        return todo;
    }
}
