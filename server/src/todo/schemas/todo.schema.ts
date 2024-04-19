import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as mongoose from "mongoose";
import {Priority} from "./priority.schemas";
import {Mark} from "./mark.schemas";

export type TodoDocument = HydratedDocument<Todo>;

//структура задачи с вторичными ключами массива отметок и приоритета
//первичные ключи mongo создаёт автоматически при новой записи
@Schema()
export class Todo {

    @Prop()
    name: string;

    @Prop()
    creation_date: Date;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Priority'})
    priority: Priority;

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref:'Mark'})
    mark: [Mark];

    @Prop()
    description: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
