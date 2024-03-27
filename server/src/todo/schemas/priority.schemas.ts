import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type PriorityDocument = HydratedDocument<Priority>;

@Schema()
export class Priority {

    @Prop()
    priority_name: string;
}

export const PrioritySchema = SchemaFactory.createForClass(Priority);
