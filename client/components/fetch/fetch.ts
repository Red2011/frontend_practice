
async function Fetch(url:string) {
    const res = await fetch(url)
    return res.json();
}

export default Fetch
