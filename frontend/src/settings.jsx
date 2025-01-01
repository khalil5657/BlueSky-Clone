import { useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router"

function Settings(){
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
        await fetch(`http://localhost:3003/logout`, {
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