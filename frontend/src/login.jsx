
import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router"
function Login({backendUrl}){
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
            const raw = await fetch(`${backendUrl}/login`, {
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
    return <div className="sign-background">
                <div className="sign-form-container">
                    <h1 className="sign-form-title">Login</h1>
                    <form action="" onSubmit={logIn} className="login-form">
                        {/* <label htmlFor="">Username</label> */}
                        <input type="text" value={username} onChange={(e)=>changeUsername(e.target.value)} placeholder="Username"/>
                        {/* <label htmlFor="">Password</label> */}
                        <input type="password" value={password} onChange={(e)=>changePassword(e.target.value)} placeholder="Password"/>
                        <button type="submit">Login</button>
                    </form>
                </div> 
            </div>

            // <div className="sign-background">
            //     <div className="sign-form-container">
            //         <h1 className="sign-form-title">Login</h1>
            //         <form action="" onSubmit={logIn} className="login-form">
            //             <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username"/>
            //             <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
            //             <button type="submit">Login!!</button>
            //         </form>
            //     </div>
                
            // </div>
}
export default Login