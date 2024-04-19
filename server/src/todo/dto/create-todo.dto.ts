import {ObjectId} from "mongoose";


//dto для создания задачи
export class CreateTodoDto {
    readonly name: string;
    readonly creation_date: Date;
    readonly priority: ObjectId;
    readonly mark: [ObjectId];
    readonly description: string;
}
