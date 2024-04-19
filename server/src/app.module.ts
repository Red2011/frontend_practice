import {Module} from "@nestjs/common";
import {TodoModule} from "./todo/todo.module";
import {MongooseModule} from "@nestjs/mongoose";


//создания подключения с базой mongoDB и логики работы с задачами
@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://root:root@cluster0.3h2e8ga.mongodb.net/?retryWrites=true&w=majority'),
        TodoModule
    ]
})
export class AppModule {}
