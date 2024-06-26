import { type FC, type ReactNode } from 'react'
import React from 'react'
import styles from "@/styles/layout.module.css"
interface layoutProps {
    children: ReactNode
}

//обертка над всеми страницами
const Layout: FC<layoutProps> = ({ children }) => (
    <>
        <main className={styles.MainPanel}>
            {children}
        </main>
    </>

)

export default Layout
