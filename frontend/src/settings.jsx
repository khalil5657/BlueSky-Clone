import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router"

function Settings({backendUrl}){
    const navigate = useNavigate()
    const [user, setUser] = useOutletContext()
    useEffect(()=>{
        ( async ()=>{
            if (!user){
                return navigate("/")
            }
        }
        )()
    }, [])
    async function logOut() {
        await fetch(`${backendUrl}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
    })    
        setUser("")
        return navigate("/")
    }
    return <div className="profile">
            <button onClick={logOut}>log out</button>
        </div>
}
export default Settings