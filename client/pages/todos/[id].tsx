import React, {useEffect, useState} from 'react';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Mark, Todo} from "@/types/todo";
import Fetch from "@/components/fetch/fetch";
import todoStyles from "@/styles/todo.module.css"
import styles from "@/styles/Main.module.css";
import {useRouter} from "next/router";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import TrueWindow from "@/components/TrueWindow/TrueWindow";
import Head from "next/head";

export default function TodoPage({todo}:InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const {id} = router.query;
    const [formattedDate, setFormattedDate] = useState<string>()
    const description  = todo.description.length > 0 ? todo.description: "...";
    const url = `http://localhost:5000/todos/${id}`;

    useEffect(() => {
        setFormattedDate(format(todo.creation_date, 'd MMMM yyyy, HH:mm', {locale: ru}))
    }, []);

    const Window:{check: boolean, visibility: 'hidden'|'visible'}  = {
        check: true,
        visibility: 'hidden'
    }
    const [changeWindow, setChangeWindow] = useState(Window)
    const DelRequest = async (url: string) => {
        try {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data: {id: string} = await res.json();
            if (res.status == 200 && data.id == id) {
                setChangeWindow({check: true, visibility: 'visible'})
                console.log("Delete: OK")
                await delay(1500);
                setChangeWindow({...changeWindow, visibility: 'hidden'})
                router.back()
            }
            else {
                setChangeWindow({check: false, visibility: 'visible'})
                console.log("Delete: Error")
                await delay(1500);
                setChangeWindow({...changeWindow, visibility: 'hidden'})
            }
        } catch (error) {
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            setChangeWindow({check: false, visibility: 'visible'})
            console.log("Delete: Error")
            await delay(1500);
            setChangeWindow({...changeWindow, visibility: 'hidden'})
        }
    }



    return (
        <>
            <Head>
                <title>{todo.name}</title>
            </Head>
            <div className={styles.MainBlock}>
                <TrueWindow check={changeWindow.check} visibility={changeWindow.visibility}/>
                <nav className={styles.NavBar}>
                    <h1>
                        Просмотр
                    </h1>
                </nav>
                <div className={styles.Component}>
                    <section className={`${todoStyles.EditPanel}`}>
                        <header className={styles.HeaderButtons}>
                            <button className={`${todoStyles.ButtonBack} ${todoStyles.Card}`} onClick={() => router.push('/')}>Назад</button>
                            <div className={styles.EditAndDeleteButtons}>
                                <button className={`${styles.ButtonBack} ${styles.Card} ${styles.EditButton}`} onClick={() => router.push(`/todos/edit_todo/${id}`)}>Редактировать</button>
                                <button className={`${styles.ButtonBack} ${styles.Card} ${styles.DelButton}`} onClick={async ()=> DelRequest(url)}>Удалить</button>
                            </div>
                        </header>
                        <div className={`${todoStyles.Card} ${todoStyles.EditCard} ${styles.ViewPanel}`}>
                            <h2 className={styles.ViewHeading}>НАЗВАНИЕ ЗАДАЧИ</h2>
                            <h3>{todo.name}</h3>
                            <h2 className={styles.ViewHeading}>ДАТА СОЗДАНИЯ</h2>
                            <h3>{formattedDate}</h3>
                            <h2 className={styles.ViewHeading}>ПРИОРИТЕТ</h2>
                            <h3>{todo.priority.priority_name}</h3>
                            <h2 className={styles.ViewHeading}>ОТМЕТКИ</h2>
                            <h3>
                                {todo.mark.map((item: Mark) => (
                                    item.mark_name + " "
                                ))}
                            </h3>
                            <h2 className={styles.ViewHeading}>ОПИСАНИЕ</h2>
                            <h3>{description}</h3>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};


export const getServerSideProps: GetServerSideProps = (async ({params}) => {
    try {
        const API_URL = (process.env.API_URL === undefined) ? "localhost:5000" : process.env.API_URL
        const todo: Todo = await Fetch(`http://${API_URL}/todos/` + params?.id);
        return {props: {todo}}
    } catch (error) {
        return {
            notFound: true
        }
    }
}) satisfies GetServerSideProps<{ todo: Todo }>
