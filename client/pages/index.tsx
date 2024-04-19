import React, {useEffect, useState} from "react";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Marks, Priorities, Todo} from "@/types/todo";
import {useRouter} from "next/router";
import styles from "@/styles/Main.module.css";
import TodoList from "@/components/Todo/TodoList";
import Fetch from "@/components/fetch/fetch";
import Loader from "@/components/loader/loader";
import Cookies from "cookies";
import cookieCutter from '@boiseitguru/cookie-cutter'
import Head from "next/head";

export default function Main({
                                 todo,
                                 marks,
                                 priorities,
                                 cookieDateSort,
                                 cookiePriorities,
                                 cookieMarks
                             }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    //используется для роутинга
    const router = useRouter()

    //все задачи (начальное значение приходит с сервера)
    const [todos, setTodos] = useState<Todo[]>(todo);
    //состояние даты (1 или -1), начальное значение приходит из Cookie
    const [state, setState] = useState<number>(Number(cookieDateSort))
    //смещение по отображаемому количеству задач для пагинации
    const [offset, setOffset] = useState(0);

    //общая смена Input: radio и  checkbox
    const [changeInput, setInput] = useState(false)

    //все выбранные отметки (marks), начальное значение берется из cookie
    const [checkMarks, setCheckMarks] = useState((cookieMarks === "") ? [""] : decodeURIComponent(cookieMarks).split(" "))
    //все выбранные приоритеты (priorities), начальное значение берется из cookie
    const [checkPriorities, setCheckPriorities] = useState((cookiePriorities === "") ? [""] : decodeURIComponent(cookiePriorities).split(" "))
    // const {ref, inView} = useInView();

    //проверка на скроллинг
    const [checkScroll, setcheckScroll] = useState(false);

    //текущее состояние требования загрузки новых задач
    const [moreTodosState, setMoreTodosState] = useState(true)

    //показ loader при загрузке новых задач
    const [checkLoader, setCheckLoader] = useState<'none' | 'flex'>('none')


    //состояние отображения спинера при загрузке данных после применения фильтров (инвертирован)
    const [filterLoad, setFilterLoad] = useState(true)

    //хендлер для срабатывания скролла при приблежении к низу страницы
    const handler = (e: any) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < e.target.documentElement.scrollHeight / 100 * 15) {
            setcheckScroll(true)
        }
    }

    //создание слушателя для скролла
    useEffect(() => {
        document.addEventListener('scroll', handler)
        return () => {
            document.removeEventListener('scroll', handler)
        }
    }, [])


    //констуктор проверки на включение элемента в массив, с последующим удалением или добавлением
    const handleFilterChange = (filter_id: string, filterList: string[]) => {
        if (filterList.includes(filter_id)) {
            return filterList.filter((element) => element !== filter_id)
        } else {
            return [...filterList, filter_id]
        }
    }

    //функция загрузки новых задач при изменении скролла и inputs
    const loadMoreTodos = async () => {
        try {
            //проверка разрешения на загрузку новых задач
            if (moreTodosState) {
                setCheckLoader('flex')
                const nextTodoList = offset + 15;
                const newTodos = await Fetch(`http://localhost:5000/todos?date_sort=${state}&offset=${nextTodoList}${checkMarks.join("")}${checkPriorities.join("")}`)
                if (newTodos) {
                    setCheckLoader('none')
                    //добавление новых задач в общий массив
                    setTodos((prevTodos: Todo[]) => [...prevTodos, ...newTodos]);
                    setOffset(nextTodoList);
                    setcheckScroll(false)
                    if (newTodos.length < 1) {
                        //отмена разрешения на загрузку, когда задач больше нет
                        setMoreTodosState(false)
                    }
                }
            }
        } catch (error) {
            console.error("Error: " + error)
        }
    };


    //функция загрузки новых задач, при изменении сортировки по дате
    const changeDateSort = async () => {
        try {
            setOffset(0);
            //разрешаем загрузку новых задач
            setMoreTodosState(true)
            //отображаем loader
            setFilterLoad(false)
            const NewSortData = await Fetch(`http://localhost:5000/todos?date_sort=${state}${checkMarks.join("")}${checkPriorities.join("")}`)
            //получаем дату и устанавливаем срок жизни 1 минуту, учитывая смещение часового пояса
            const nowDate = new Date()
            const dateOffset = nowDate.getTimezoneOffset() * 60 * 1000;
            nowDate.setTime(nowDate.getTime() + dateOffset + (60 *1000));
            //записываем все фильтры и срок жизни в cookies
            cookieCutter.set("date_sort", state.toString(), {expires: nowDate})
            cookieCutter.set("priority", checkPriorities.join(" "), {expires: nowDate})
            cookieCutter.set("marks", checkMarks.join(" "), {expires: nowDate})
            if (NewSortData) {
                //скрываем loader
                setFilterLoad(true)
                setTodos(NewSortData);
                setInput(false)
            }
        } catch (error) {
            console.error("Error: " + error)
        }

    }


    //выполнение функций получения задач на клиенте при фильтрах и пагинации,
    //при изменении элементов фильтра и скролла
    useEffect(() => {
        if (changeInput) {
            changeDateSort().then(r => console.log("Sort change OK"));
        }
        if (checkScroll) {
            loadMoreTodos().then(r => console.log("View loader OK"));
        }
    }, [checkScroll, changeInput]);


    //отображение лоадера, пока задачи не загружены
    const checkLoaderForFilter = () => {
        if (filterLoad) {
            return (
                <TodoList todos={todos}/>
            )
        } else {
            return (
                <div className={`${styles.Loader}`} style={{display: "flex"}}>
                    <Loader/>
                </div>
            )
        }
    }

    return (
        <>
            <Head>
                <title>Список задач</title>
            </Head>
            <div className={styles.MainBlock}>
                <nav className={styles.NavBar}>
                    <h1>
                        Список задач
                    </h1>
                </nav>
                <div className={styles.Component}>
                    <form className={styles.controlPanel}>
                        <fieldset className={styles.fieldset}>
                            <h2>СОРТИРОВКА</h2>
                            {/*фильтры сортировки по дате*/}
                            <p className={styles.radioName}><input className={styles.radioControl} name="oldnew"
                                                                   type="radio" value={1} onChange={e => {
                                setState(Number(e.target.value));
                                //разрешение на запуск функции получения задач
                                setInput(true)
                            }} checked={state === 1}/>Старые</p>
                            <p className={styles.radioName}><input className={styles.radioControl} name="oldnew"
                                                                   type="radio" value={-1} onChange={e => {
                                setState(Number(e.target.value));
                                //разрешение на загрузку новых задач при выборе фильтра
                                setInput(true)
                            }} checked={state === -1}/>Новые</p>
                        </fieldset>
                        <fieldset className={styles.fieldset}>
                            <h2>ПРИОРИТЕТ</h2>
                            {priorities.priorities.map(priority => (
                                <p key={priority._id} className={styles.radioName}><input type="checkbox"
                                                                                          checked={checkPriorities.includes(`&priority=${priority._id}`)}
                                                                                          onChange={() => {
                                                                                              //изменение массива выбранных приоритетов, в зависимости от состояния
                                                                                              setCheckPriorities(handleFilterChange(`&priority=${priority._id}`, checkPriorities));
                                                                                              //разрешение на загрузку новых задач при выборе фильтра
                                                                                              setInput(true)
                                                                                          }}/>{priority.priority_name}
                                </p>
                            ))}
                            <h2>ОТМЕТКА</h2>
                            {marks.marks.map(mark => (
                                <p key={mark._id} className={styles.radioName}><input
                                    checked={checkMarks.includes(`&marks=${mark._id}`)} type="checkbox"
                                    onChange={() => {
                                        //работоспособность аналогично приоритетам
                                        setCheckMarks(handleFilterChange(`&marks=${mark._id}`, checkMarks));
                                        setInput(true)
                                    }}/>{mark.mark_name}
                                </p>
                            ))}
                        </fieldset>
                    </form>
                    <article className={styles.todoList}>
                        <header className={styles.ButtonHeader}>
                            <button className={`${styles.Card} ${styles.ButtonSave}`}
                                    onClick={() => router.push('/todos/edit_todo')}>Добавить задачу
                            </button>
                        </header>
                        {checkLoaderForFilter()}
                        <div className={`${styles.Loader}`} style={{display: checkLoader}}>
                            <Loader/>
                        </div>
                    </article>
                </div>
                {/*<div ref={ref}>*/}
                {/*    Loading...*/}
                {/*</div>*/}
            </div>
        </>

    )

}


//серверный компонент для получения данных
export const getServerSideProps = (async ({req, res}) => {
    try {
        //env используется для docker
        const API_URL = (process.env.API_URL === undefined) ? "localhost:5000" : process.env.API_URL
        const cookies = new Cookies(req, res);
        //получение состояний филтров из cookies
        const cookieDateSort = (cookies.get('date_sort') || "-1");
        const cookiePriorities = (cookies.get('priority') || "")
        const cookieMarks = (cookies.get('marks') || "")
        //получение данных с сервера
        const todo: Todo[] = await Fetch(`http://${API_URL}/todos?date_sort=${Number(cookieDateSort)}${decodeURIComponent(cookieMarks).replace(/\s/g, "")}${decodeURIComponent(cookiePriorities).replace(/\s/g, "")}`);
        const marks: Marks = await Fetch(`http://${API_URL}/todos/mark`);
        const priorities: Priorities = await Fetch(`http://${API_URL}/todos/priority`);
        return {
            props: {
                todo,
                marks,
                priorities,
                cookieDateSort,
                cookiePriorities,
                cookieMarks
            }
        }
    } catch (error) {
        return {
            //вызов 404 страницы
            notFound: true
        }
    }
}) satisfies GetServerSideProps<{
    todo: Todo[],
    marks: Marks,
    priorities: Priorities,
    cookieDateSort: string,
    cookiePriorities: string,
    cookieMarks: string
}>
