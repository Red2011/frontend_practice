import React from 'react';
import styles from "@/styles/Main.module.css";
import EditTodoItem from "@/components/Todo/EditTodoItem";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Marks, Priorities, Todo} from "@/types/todo";
import Fetch from "@/components/fetch/fetch";

const UpdateTodo = ({todo, marks, priorities}:InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <div className={styles.MainBlock}>
            <nav className={styles.NavBar}>
                <h1>
                    Редактирование
                </h1>
            </nav>
            <div className={styles.Component}>
                <EditTodoItem todo={todo} marks={marks} priorities={priorities}/>
            </div>
        </div>
    );
};

export default UpdateTodo;

export const getServerSideProps = (async ({params}) => {
    try {
        const marks: Marks = await Fetch('http://localhost:5000/todos/mark');
        const priorities: Priorities = await Fetch('http://localhost:5000/todos/priority');
        const todo = await Fetch('http://localhost:5000/todos/' + params?.id);
        return {
            props: {
                todo,
                marks,
                priorities
            }
        }
    } catch (error) {
        return {
            notFound: true
        }
    }
}) satisfies GetServerSideProps<{todo: Todo, marks:Marks, priorities: Priorities }>
