import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Router from 'next/router'
import { useState, useEffect } from 'react';
import Wraploader from "../components/loader/Wraploader"

export default function App({ Component, pageProps }: AppProps) {
    const [isLoading, setIsLoading] = useState(false);
    //отображение лоадера при пееремещении между страницами в зависимости от загрузки данных
    useEffect(() => {
        Router.events.on("routeChangeStart", ()=>{
            setIsLoading(true)
        });

        Router.events.on("routeChangeComplete", ()=>{
            setIsLoading(false)
        });

        Router.events.on("routeChangeError", () =>{
            setIsLoading(false)
        });

    }, [Router])

    return (
        <Layout>
            {isLoading && <Wraploader/>}
            <Component {...pageProps} />
        </Layout>
    );
}
