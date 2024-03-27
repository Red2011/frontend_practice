import {ObjectId} from "mongoose";

export class CreateTodoDto {
    readonly name: string;
    readonly creation_date: Date;
    readonly priority: ObjectId;
    readonly mark: [ObjectId];
    readonly description: string;
}
