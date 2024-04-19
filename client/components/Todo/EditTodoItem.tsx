import React, {useEffect, useRef, useState} from 'react';
import styles from "@/styles/todo.module.css";
import {Marks, Priorities, Todo, TodoItemProps} from "@/types/todo";
import {useRouter} from "next/router";
import TrueWindow from "@/components/TrueWindow/TrueWindow";


//выбор необходимого метода запроса: создание новой задачи, или обновление информации в задаче
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
    //получение id задачи
    const {id} = router.query;
    //выбор метода запроса
    const serverComponent = changeServerMethod(typeof id === 'string' ? id : undefined);
    //проверка на пустоту значений отметок и приоритетов по их id
    let markList = todo.mark.map(item => item._id)
    markList = markList.length === 1 && markList[0] === "" ? [] : markList;
    const priority = todo.priority._id === "" ? priorities.priorities[0]._id : todo.priority._id

    //объект с новой задачей, который будет отправляться в запросе
    const newTodo = {
        name: todo.name,
        creation_date: todo.creation_date,
        priority: priority,
        mark: markList,
        description: todo.description
    }

    //состояние для изменения объекта
    const [changedTodo, setChangedTodo] = useState(newTodo)

    //сохранение dom-элемент textarea в переменной
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    //изменение текста textarea
    const [currentValueTextArea, setcurrentValueTextArea ] = useState("");


    //окно с результатом запроса
    const Window:{check: boolean, visibility: 'hidden'|'visible'}  = {
        check: true,
        visibility: 'hidden'
    }
    const [changeWindow, setChangeWindow] = useState(Window)

    //изменение цвета input с названием задачи в зависимости от пустоты
    const [inputColor, setInputColor] = useState('#F34949')


    //конструктор проверки на включение элемента в массив, с последующим удалением или добавлением
    const handleFilterChange = (filter_id:string, filterList: string[]) => {
        if (filterList.includes(filter_id)) {
            return filterList.filter((element) => element !== filter_id)
        }
        else {
            return [...filterList, filter_id]
        }
    }


    //изменение любого поля у объекта с задачей
    const handleChangeTodo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string[], newValue: keyof Todo) => {
        if (Array.isArray(e))
            setChangedTodo({...changedTodo, [newValue]: e})
        else {
            setChangedTodo({...changedTodo, [newValue]: e.target.value});
        }
    }

    //изменение цвета отметки, если она выбрана (присутствует в массиве отметок)
    //массив отметок берется из changedTodo, а изменяется с помощью handleChangeTodo
    const changeColor = (idList:string[], id:string) => {
        if (idList.includes(id)) {
            return '#CECECE'
        }
        else {
            return "transparent"
        }
    }

    //подсвечивание рамки input с названием задачи
    useEffect(() => {
        if (changedTodo.name === "") {
            setInputColor('#F34949')
        }
        else {
            setInputColor('#AFAFAF')
        }
    }, [changedTodo.name])


    //функция с выполнением Put или Post запроса в зависимости от результата changeServerMethod
    //вызывается кнопкой Сохранить
    const PutOrPostRequest = async (url: string, method: string, todo_data: any) => {
        try {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            //Посмотреть, эта строчка не учитывается, т.к. время мы используем todo_data
            //а setChangedTodo отрабатывает после
            //дата в итоге берется из index
            //setChangedTodo({...changedTodo, name: "sss"})
            //сделать правильное поведение даты, т.к. она не успевает установиться правильно, fetch быстрее


            //запрет на сохранение при пустом name (показывается окно с ошибкой)
            //добавить если человек просто напишет пробел
            if (todo_data.name === "") {
                setChangeWindow({check: false, visibility: 'visible'})
                console.log("Error")
                await delay(1500);
                setChangeWindow({...changeWindow, visibility: 'hidden'})
            }
            else {
                //отправка на сервер json при запросе
                const res = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(todo_data)
                })
                const data:Todo = await res.json()
                //успешная обработка post запроса
                if (res.status == 201) {
                    setChangeWindow({check: true, visibility: 'visible'})
                    console.log("Create: OK")
                    await delay(1500);
                    router.back()
                }
                //успешная обработка put запроса
                else if (res.status == 200 && data._id === id) {
                    setChangeWindow({check: true, visibility: 'visible'})
                    console.log("Update: OK")
                    await delay(1500);
                    router.back()
                }
                else {
                    setChangeWindow({check: false, visibility: 'visible'})
                    console.log("Method Error")
                    await delay(1500);
                    setChangeWindow({...changeWindow, visibility: 'hidden'})
                }
            }
        } catch (error) {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            setChangeWindow({check: false, visibility: 'visible'})
            console.log("Error" + error)
            await delay(1500);
            setChangeWindow({...changeWindow, visibility: 'hidden'})
        }

    }
    //изменение высоты textarea в зависимости от количества занимаемых строк текстом
    useEffect(() => {
        if (textareaRef.current != null) {
            textareaRef.current.style.height = "0px";
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = scrollHeight + "px";
        }
    }, [currentValueTextArea]);



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
                        /*запись в объект значения выбранного приоритета*/
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
                            /*запись в объект массива отметок при выделении/отмене выделения*/
                            onClick={() => handleChangeTodo(handleFilterChange(mark._id, changedTodo.mark), 'mark')}>{mark.mark_name}
                        </li>
                    )))}
                </ul>
                <h2>Описание</h2>
                <textarea className={`${styles.InputEditName} ${styles.EditDescription}`}
                          placeholder="..." value={changedTodo.description}
                          ref={textareaRef}
                          onChange={(e) => {
                              handleChangeTodo(e, 'description')
                              setcurrentValueTextArea(e.target.value);
                          }}/>
                <footer>
                    <button  className={`${styles.ButtonSave} ${styles.Card}`} onClick={()=> {
                        PutOrPostRequest(serverComponent.url, serverComponent.method, changedTodo)
                    }}>Сохранить</button>
                </footer>
            </div>
        </section>
    );
};

export default EditTodoItem;
