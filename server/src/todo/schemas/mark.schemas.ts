import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MarkDocument = HydratedDocument<Mark>;

@Schema()
export class Mark {

    @Prop()
    mark_name: string;
}

export const MarkSchema = SchemaFactory.createForClass(Mark);
