import React from 'react';
import styles from '@/styles/loader.module.css'


interface Windows {
    check: boolean,
    visibility: 'hidden' | 'visible'
}

//информационное окно
const TrueWindow: React.FC<Windows> = ({check, visibility}) => {

    const TrueCheck = () => {
        return (
            <div className={styles.MainBlock}>
                <svg className={styles.SVG} fill="#2BFF24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                     xmlnsXlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 305.002 305.002"
                     xmlSpace="preserve">
                    <g>
                        <circle cx="152.502" cy="152.501" r="127.5" fill="#2BFF24" />
                        <g>
                            <path d="M152.502,0.001C68.412,0.001,0,68.412,0,152.501s68.412,152.5,152.502,152.5c84.089,0,152.5-68.411,152.5-152.5
			                        S236.591,0.001,152.502,0.001z M152.502,280.001C82.197,280.001,25,222.806,25,152.501c0-70.304,57.197-127.5,127.502-127.5
			                        c70.304,0,127.5,57.196,127.5,127.5C280.002,222.806,222.806,280.001,152.502,280.001z"/>
                            <path fill="white" d="M218.473,93.97l-90.546,90.547l-41.398-41.398c-4.882-4.881-12.796-4.881-17.678,0c-4.881,4.882-4.881,12.796,0,17.678
			                                      l50.237,50.237c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l99.385-99.385
			                                      c4.881-4.882,4.881-12.796,0-17.678C231.269,89.089,223.354,89.089,218.473,93.97z"/>
                        </g>
                    </g>
                </svg>
                <h1 className={styles.Name}>Успешно</h1>
            </div>
        )
    }

    const FalseCheck = () => {
        return (
            <div className={styles.MainBlock}>
                <svg className={styles.SVG} viewBox="0 0 23 23" fill="red" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"  xmlSpace="preserve">
                    <path d="M16 8L8 16M8.00001 8L16 16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DCD9E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className={styles.Name}>Не удалось выполнить</h1>
            </div>
        )
    }

    //выбор отображаемого содержимого окна в зависимости от check
    if (check) {
        return (
            <div className={styles.wrapper} style={{visibility: visibility}}>
                <TrueCheck/>
            </div>
        )
    }
    else {
        return (
            <div className={styles.wrapper}>
                <FalseCheck/>
            </div>
        )
    }
};

export default TrueWindow;
