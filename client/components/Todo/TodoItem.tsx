import React, {useEffect, useState} from 'react';
import styles from "../../styles/todo.module.css"
import {TodoItemProps} from "@/types/todo";
import {useRouter} from "next/router";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';


const TodoItem: React.FC<TodoItemProps> = ({todo}) => {
    const router = useRouter()
    const [formattedDate, setFormatedDate] = useState<string>()
    useEffect(() => {
        setFormatedDate(format(todo.creation_date, 'd MMMM yyyy, HH:mm', {locale: ru}))
    }, []);
    const checkEmptyMarks = () => {
        if (todo.mark.length > 0){
            return (
                <li className={styles.CardInfo}>Отметки: {todo.mark.map(mark => mark.mark_name + " ")}</li>
            )
        }
        else {
            return (
                <li className={styles.CardInfo}>Отметки: отсутствуют</li>
            )
        }
    }
    return (
        <ul className={styles.Card}>
            <li className={styles.CardName} onClick={() => router.push('/todos/' + todo._id)}>{todo.name}</li>
            <li className={styles.CardInfo} >создано: {formattedDate}</li>
            <li className={styles.CardInfo}>Приоритет: {todo.priority.priority_name}</li>
            {checkEmptyMarks()}
        </ul>
    );
};

export default TodoItem;
