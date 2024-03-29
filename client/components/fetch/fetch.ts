async function Fetch(url:string) {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error(`${res.status}`)
        }
        return res.json();
    } catch (e: any) {
        throw new Error(`${(e as Error).message}`)
    }
}

export default Fetch
