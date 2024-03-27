
async function Fetch(url:string) {
    //const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const res = await fetch(url)
    //await delay(5000)
    return res.json();
}

export default Fetch
