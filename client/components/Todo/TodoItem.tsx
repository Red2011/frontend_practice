import React, {useEffect, useState} from 'react';
import styles from "@/styles/todo.module.css"
import {TodoItemProps} from "@/types/todo";
import {useRouter} from "next/router";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';


const TodoItem: React.FC<TodoItemProps> = ({todo}) => {
    const router = useRouter()
    const [formattedDate, setFormatedDate] = useState<string>()

    const getHours = (hours: number) => {
        let titles = ['час', 'часа', 'часов']
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(hours % 100 > 4 && hours % 100 < 20) ? 2 : cases[(hours % 10 < 5) ? hours % 10 : 5]]
    }
    const getMinutes = (minutes: number) => {
        let titles = ['минуту', 'минуты', 'минут']
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(minutes % 100 > 4 && minutes % 100 < 20) ? 2 : cases[(minutes % 10 < 5) ? minutes % 10 : 5]]
    }
    useEffect(() => {
        const nowDate = new Date();
        const todoDate = new Date(todo.creation_date)
        const datesMinutes = Math.floor(Math.abs(nowDate.getTime() - todoDate.getTime()) / (1000 * 60));
        if (datesMinutes < 1) {
            setFormatedDate("только что")
        }
        else if (datesMinutes < 60 ) {
            setFormatedDate(`${datesMinutes} ${getMinutes(datesMinutes)} назад`)
        }
        else {
            const hoursAgo = Math.floor(datesMinutes / 60)
            setFormatedDate((hoursAgo < 24) ? `${hoursAgo} ${getHours(hoursAgo)} назад` : format(todo.creation_date, 'd MMMM yyyy, HH:mm', {locale: ru}))
        }
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
