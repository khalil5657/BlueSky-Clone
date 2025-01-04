
import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router"
function Login(){
    const [user, setUser, setSearchValue, setUsersWithNewMessages2, setUpdate] = useOutletContext()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
        ( async ()=>{
            if (user){
                return navigate("/")
            }
        }
        )()
    }, [])
    async function logIn(e){
        e.preventDefault()

        try{
            const raw = await fetch(`https://bluesky-clone.onrender.com/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(
            { username,
                password }
            )
            })
            const user = await raw.json()
            if (user.username){
                setUser(user)
                setUpdate({})
                return navigate("/")
            }else{
                console.log(user.message)
            }
        }catch{
                console.log("try again!")
            }
            }

    function changeUsername(value){
        setUsername(value)
    }

    function changePassword(value){
        setPassword(value)
    }
    return <div>
                <h1>Login</h1>
                <form action="" onSubmit={logIn}>
                    <label htmlFor="">Username</label>
                    <input type="text" value={username} onChange={(e)=>changeUsername(e.target.value)}/>
                    <label htmlFor="">Password</label>
                    <input type="password" value={password} onChange={(e)=>changePassword(e.target.value)}/>
                    <button type="submit">Login</button>
                </form>
            </div>
}
export default Login