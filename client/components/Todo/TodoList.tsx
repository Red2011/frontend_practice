import React from 'react';
import {Todo} from "@/types/todo";
import TodoItem from "@/components/Todo/TodoItem";

interface TodoListProps {
    todos: Todo[]
}

const TodoList:React.FC<TodoListProps> = ({todos}) => {
    //компонент с задачами
    // const router = useRouter()
    const checkEmptyTodos = () => {
        if (todos.length > 0) {
            return (
                todos.map(todo =>
                    <TodoItem
                            key={todo._id}
                            todo = {todo}
                        />
                )
            )
        }
        else {
            return (
                <div>Данных нет</div>
            )
        }
    }


    return (
        checkEmptyTodos()
    );
};
export default TodoList;
