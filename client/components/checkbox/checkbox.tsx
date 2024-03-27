import styles from "./checkbox.module.css"


export default function CheckBox({label}:{label: string}) {

    return(
        <div className={styles.checkboxWrapper28}>
            <input id="tmp-28" type="checkbox" className={styles.promotedInputCheckbox}/>
            <svg><use xlinkHref="#checkmark-28" /></svg>
            <label htmlFor="tmp-28">{label}</label>
            <svg xmlns="http://www.w3.org/2000/svg" style={{display: "none"}}>
                <symbol id="checkmark-28" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeMiterlimit="10" fill="none" d="M22.9 3.7l-15.2 16.6-6.6-7.1">
                    </path>
                </symbol>
            </svg>
        </div>
)
}
