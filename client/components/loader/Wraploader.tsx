import styles from "../../styles/loader.module.css"
import Loader from "@/components/loader/loader";


const Wraploader = () => {
    return (
        <div className={styles.wrapper}>
            <Loader/>
        </div>
    );
}

export default Wraploader;
