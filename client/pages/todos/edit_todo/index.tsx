import React from 'react';
import styles from "@/styles/Main.module.css";
import EditTodoItem from "@/components/Todo/EditTodoItem";
import {Marks, Priorities, Todo} from "@/types/todo";
import Fetch from "@/components/fetch/fetch";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import Head from "next/head";

const EditTodo = ({marks, priorities}:InferGetServerSidePropsType<typeof getServerSideProps>) => {
    //пустая задача для отображения на экране при создании новой
    const emptyTodo: Todo = {
        _id: "",
        name: "",
        creation_date: new Date(),
        priority: {
            _id:"",
            priority_name: ""
        },
        mark: [{
            _id: "",
            mark_name: ""
        }],
        description: "",
        __v: 0

    }
    return (
        <>
            <Head>
               <title>Создание задачи</title>
            </Head>
            <div className={styles.MainBlock}>
                <nav className={styles.NavBar}>
                    <h1>
                        Редактирование
                    </h1>
                </nav>
                <div className={styles.Component}>
                    <EditTodoItem todo={emptyTodo} marks={marks} priorities={priorities}/>
                </div>
            </div>
        </>
    );
};

export default EditTodo;

export const getServerSideProps = (async () => {
    try {
        const API_URL = (process.env.API_URL === undefined) ? "localhost:5000" : process.env.API_URL
        const marks: Marks = await Fetch(`http://${API_URL}/todos/mark`);
        const priorities: Priorities = await Fetch(`http://${API_URL}/todos/priority`);
        return {
            props: {
                marks,
                priorities
            }
        }
    } catch (error) {
        return {
            notFound: true
        }
    }
}) satisfies GetServerSideProps<{marks:Marks, priorities: Priorities }>
