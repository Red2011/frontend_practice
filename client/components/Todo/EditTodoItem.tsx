import React, {useEffect, useState} from 'react';
import styles from "@/styles/todo.module.css";
import {Marks, Priorities, Todo, TodoItemProps} from "@/types/todo";
import {useRouter} from "next/router";
import TrueWindow from "@/components/TrueWindow/TrueWindow";


const changeServerMethod = (id:string|undefined) => {
    let url: string;
    let method: "POST" | "PUT";

    if (id === undefined) {
        url = "http://localhost:5000/todos";
        method = "POST";
    } else {
        url = `http://localhost:5000/todos/${id}`;
        method = "PUT";
    }
    return {url, method};
}

const EditTodoItem: React.FC<TodoItemProps & { marks: Marks; priorities: Priorities }> = ({ todo, marks, priorities }) => {
    const router = useRouter()
    const {id} = router.query;
    const serverComponent = changeServerMethod(typeof id === 'string' ? id : undefined);
    console.log(serverComponent.method);
    let markList = todo.mark.map(item => item._id)
    markList = markList.length === 1 && markList[0] === "" ? [] : markList;
    const priority = todo.priority._id === "" ? priorities.priorities[0]._id : todo.priority._id

    const newTodo = {
        name: todo.name,
        creation_date: todo.creation_date,
        priority: priority,
        mark: markList,
        description: todo.description
    }
    const [changedTodo, setChangedTodo] = useState(newTodo)
    const Window:{check: boolean, visibility: 'hidden'|'visible'}  = {
        check: true,
        visibility: 'hidden'
    }
    const [changeWindow, setChangeWindow] = useState(Window)
    const [inputColor, setInputColor] = useState('#F34949')

    const handleFilterChange = (filter_id:string, filterList: string[]) => {
        if (filterList.includes(filter_id)) {
            return filterList.filter((element) => element !== filter_id)
        }
        else {
            return [...filterList, filter_id]
        }
    }

    const handleChangeTodo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string[], newValue: keyof Todo) => {
        if (Array.isArray(e))
            setChangedTodo({...changedTodo, [newValue]: e})
        else {
            setChangedTodo({...changedTodo, [newValue]: e.target.value});
        }
    }
    const changeColor = (idList:string[], id:string) => {
        if (idList.includes(id)) {
            return '#CECECE'
        }
        else {
            return "transparent"
        }
    }

    useEffect(() => {
        if (changedTodo.name === "") {
            setInputColor('#F34949')
        }
        else {
            setInputColor('#AFAFAF')
        }
    }, [changedTodo.name])

    const PutOrPostRequest = async (url: string, method: string, todo_data: any) => {
        try {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            setChangedTodo({...changedTodo, creation_date: new Date()})
            if (todo_data.name === "") {
                setChangeWindow({check: false, visibility: 'visible'})
                console.log("Error")
                await delay(1500);
                setChangeWindow({...changeWindow, visibility: 'hidden'})
            }
            else {
                const res = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(todo_data)
                })
                const data:Todo = await res.json()
                if (res.status == 201) {
                    setChangeWindow({check: true, visibility: 'visible'})
                    console.log("Create: OK")
                    await delay(1500);
                    router.back()
                }
                else if (res.status == 200 && data._id === id) {
                    setChangeWindow({check: true, visibility: 'visible'})
                    console.log("Update: OK")
                    await delay(1500);
                    router.back()
                }
                else {
                    setChangeWindow({check: false, visibility: 'visible'})
                    console.log("Error")
                    await delay(1500);
                    setChangeWindow({...changeWindow, visibility: 'hidden'})
                }
            }
        } catch (error) {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            setChangeWindow({check: false, visibility: 'visible'})
            console.log("Error")
            await delay(1500);
            setChangeWindow({...changeWindow, visibility: 'hidden'})
        }

    }

    return (
        <section className={`${styles.EditPanel}`}>
            <TrueWindow check={changeWindow.check} visibility={changeWindow.visibility}/>
            <header>
                <button className={`${styles.ButtonBack} ${styles.Card}`} onClick={() => router.back()}>Назад</button>
            </header>
            <div className={`${styles.Card} ${styles.EditCard}`}>
                <h2>Название задачи</h2>
                <input className={`${styles.InputEditName}`} style={{borderColor: inputColor}} type="text" value={changedTodo.name}
                       onChange={(e) => handleChangeTodo(e, 'name')}/>
                <h2>Приоритет</h2>
                <select className={`${styles.InputEditName} ${styles.SelectPriorityAndMarks}`}
                        value={changedTodo.priority}
                        onChange={(e) => handleChangeTodo(e, 'priority')}>
                    {priorities.priorities.map(priority => (
                        <option key={priority._id} value={priority._id}>{priority.priority_name}</option>
                    ))}
                </select>
                <h2>Отметки</h2>
                <ul className={`${styles.InputEditName} ${styles.SelectPriorityAndMarks} ${styles.EditTableMArks}`}>
                    {marks.marks.map((mark => (
                        <li key={mark._id}
                            className={styles.MarkName}
                            style={{backgroundColor: changeColor(changedTodo.mark, mark._id)}}
                            onClick={() => handleChangeTodo(handleFilterChange(mark._id, changedTodo.mark), 'mark')}>{mark.mark_name}
                        </li>
                    )))}
                </ul>
                <h2>Описание</h2>
                <textarea className={`${styles.InputEditName} ${styles.EditDescription}`} placeholder="..." value={changedTodo.description} onChange={(e) => handleChangeTodo(e, 'description')}/>
                <footer>
                    <button  className={`${styles.ButtonSave} ${styles.Card}`} onClick={()=> PutOrPostRequest(serverComponent.url, serverComponent.method, changedTodo)}>Сохранить</button>
                </footer>
            </div>
        </section>
    );
};

export default EditTodoItem;
